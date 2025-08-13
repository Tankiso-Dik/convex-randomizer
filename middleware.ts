import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/products/:path*"], // gate the CRM only
};

export function middleware(req: NextRequest) {
  // Always discourage indexing on CRM
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");

  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return res; // no friction in local dev; set ADMIN_PASSWORD in prod

  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="admin"' },
    });
  }
  // Edge-safe base64 decode
  const decoded = globalThis.atob(header.slice(6));
  const supplied = decoded.split(":")[1] ?? "";

  if (supplied !== pw) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return res;
}

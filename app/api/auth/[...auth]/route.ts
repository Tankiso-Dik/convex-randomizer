import NextAuth from "@auth/nextjs";
import GitHub from "@auth/core/providers/github";

export const { GET, POST } = NextAuth({
  providers: [GitHub],
});

import { auth } from "@convex-dev/auth";
import GitHub from "@auth/core/providers/github";

export default auth({
  providers: [GitHub],
});

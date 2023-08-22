import { withAuth } from "next-auth/middleware";
import { parse } from "url";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  {
    pages: {
      signIn: "/login",
    },
  }
);
export const config = { matcher: ["/dashboard/:path*"] };

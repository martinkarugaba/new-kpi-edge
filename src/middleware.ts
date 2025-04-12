import { auth } from "./features/auth/auth";

// Export the Next.js middleware
export default auth;

// Specify which routes to apply middleware to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

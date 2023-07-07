import type { AuthObject } from "@clerk/backend";
import { authMiddleware } from "@clerk/nextjs";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Auth = AuthObject & { isPublicRoute: boolean };

function redirect(req: NextRequest, url: string | URL) {
  if (url.toString().startsWith(req.url)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(url);
}

function isUserSignedIn(auth: Auth) {
  return !!auth.userId;
}

function shouldUserSignIn(auth: Auth) {
  return !isUserSignedIn(auth) && !auth.isPublicRoute;
}

function redirectUnauthorizedUser(req: NextRequest): NextResponse {
  const signInUrl = new URL("/sign-in", req.url);
  return redirect(req, signInUrl);
}

export function trpcMiddleware(
  _auth: Auth,
  _req: NextRequest,
  _event: NextFetchEvent
) {
  return NextResponse.next();
}

export default authMiddleware({
  afterAuth(auth, req, _evt) {
    if (req.url.includes("trpc") || req.url.includes("api")) {
      return NextResponse.next();
    }

    if (shouldUserSignIn(auth)) {
      return redirectUnauthorizedUser(req);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

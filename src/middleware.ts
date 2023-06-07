import type { AuthObject } from "@clerk/backend";
import { authMiddleware } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Auth = AuthObject & { isPublicRoute: boolean };

function isUserSignedIn(auth: Auth) {
  return !!auth.userId;
}

function shouldUserSignIn(auth: Auth) {
  return !isUserSignedIn(auth) && !auth.isPublicRoute;
}

function redirectUnauthorizedUser(req: NextRequest): NextResponse {
  if (
    req.url.startsWith(new URL("/sign-in", req.url).toString()) ||
    req.url.startsWith(new URL("/sign-up", req.url).toString())
  ) {
    console.log("DON'T REDIRECT");
    return NextResponse.next();
  }
  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("redirect_url", req.url);
  return NextResponse.redirect(signInUrl);
}

function hasUserFinishedAccountSetup(auth: Auth) {
  return (
    auth.user?.privateMetadata?.companyId != null &&
    auth.user?.privateMetadata?.companyId != undefined
  );
}

function redirectToAccountSetup(req: NextRequest) {
  const accountSetupUrl = new URL("/account-setup", req.url);
  return NextResponse.redirect(accountSetupUrl);
}

export default authMiddleware({
  afterAuth(auth, req, _evt) {
    if (shouldUserSignIn(auth)) {
      return redirectUnauthorizedUser(req);
    }

    if (isUserSignedIn(auth)) {
      if (!hasUserFinishedAccountSetup(auth)) {
        return redirectToAccountSetup(req);
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

import type { AuthObject } from "@clerk/backend";
import { authMiddleware } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Auth = AuthObject & { isPublicRoute: boolean };

function redirect(req: NextRequest, url: string | URL) {
  if (req.url.startsWith(url.toString())) {
    return NextResponse.next();
  } 

  return NextResponse.redirect(url)
}

function isUserSignedIn(auth: Auth) {
  return !!auth.userId;
}

function shouldUserSignIn(auth: Auth) {
  return !isUserSignedIn(auth) && !auth.isPublicRoute;
}

function redirectUnauthorizedUser(req: NextRequest): NextResponse {
  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("redirect_url", req.url);
  return redirect(req, signInUrl);
}

function hasUserFinishedAccountSetup(auth: Auth) {
  return (
    auth.user?.privateMetadata?.companyId != null &&
    auth.user?.privateMetadata?.companyId != undefined
  );
}

function redirectToAccountSetup(req: NextRequest) {
  const accountSetupUrl = new URL("/account-setup", req.url);
  return redirect(req, accountSetupUrl);
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

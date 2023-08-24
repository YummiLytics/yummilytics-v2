import { SignIn, useUser } from "@clerk/nextjs";
import Router from "next/router";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (isSignedIn) {
    Router.push("/dashboard").catch((err) => {
      console.log(err);
    });
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;

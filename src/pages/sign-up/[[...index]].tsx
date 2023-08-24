import type { NextPage } from "next";
import Router from "next/router";
import { SignUp, useUser } from "@clerk/nextjs";

const SignUpPage: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (isSignedIn) {
    Router.push("/dashboard").catch((err) => {
      console.log(err);
    });
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;

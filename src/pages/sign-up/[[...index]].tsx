import type { NextPage } from "next";
import Router from "next/router";
import { SignUp, useUser } from "@clerk/nextjs";

const SignUpPage: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex h-full w-full items-center justify-center md:py-16">
        <SignUp />
      </div>
    );
  } else {
    Router.push("/dashboard").catch((err) => {
      console.log(err);
    });
  }

  return null;
};

export default SignUpPage;

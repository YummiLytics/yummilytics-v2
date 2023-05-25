import { SignUp, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

type FormInput = {
  firstName: string;
};

const SignUpPage: NextPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { register, handleSubmit } = useForm<FormInput>();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex h-full w-full items-center justify-center md:py-16">
        <SignUp />
      </div>
    );
  }

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName", {valueAsNumber: true})} />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default SignUpPage;

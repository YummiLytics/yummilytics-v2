import { useEffect } from "react";
import { useState } from "react";
import type { NextPage } from "next";
import CreateCompany from "./CreateCompany";
import CreateFirstLocation from "./CreateFirstLocation";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type SetupFormPage } from "~/types";
import { SetupPage } from "~/types/enums";

const setupPages: { [P in SetupPage]: SetupFormPage } = {
  [SetupPage.CREATE_COMPANY]: CreateCompany,
  [SetupPage.CREATE_LOCATION]: CreateFirstLocation,
};

const AccountSetupPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<SetupPage | null>(null);

  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { data: userData, isFetched } = api.user.getByClerkId.useQuery(
    user?.id ?? ""
  );

  useEffect(() => {
    if (!isLoaded || !isFetched || currentPage != null) {
      return;
    }

    if (!isSignedIn) {
      router.push("/sign-in").catch((e) => console.log(e));
    }

    if (userData?.companyId != null) {
      router.push("/dashboard").catch((e) => console.log(e));
      return;
    }

    setCurrentPage(SetupPage.CREATE_COMPANY);
  }, [
    isLoaded,
    isFetched,
    currentPage,
    userData?.companyId,
    router,
    isSignedIn,
  ]);

  const CurrentSetupPage = currentPage ? setupPages?.[currentPage] : null;

  if (!isLoaded || !isSignedIn || CurrentSetupPage == null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="flex h-full min-h-screen items-center justify-center">
        <div className="container mx-auto mt-10 max-w-2xl rounded-md border border-gray-200 bg-white p-4 drop-shadow">
          <CurrentSetupPage
            setCurrentPage={setCurrentPage}
            user={user}
            userData={userData}
          />
        </div>
      </div>
    </SignedIn>
  );
};

export default AccountSetupPage;

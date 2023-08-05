import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SignedIn, useUser } from "@clerk/nextjs";
import { type SetupFormPage } from "~/types";
import { SetupPage } from "~/types/enums";
import { api } from "~/utils/api";
import CreateCompany from "./CreateCompany";
import CreateFirstLocation from "./CreateFirstLocation";

const setupPages: { [P in SetupPage]: SetupFormPage } = {
  [SetupPage.CREATE_COMPANY]: CreateCompany,
  [SetupPage.CREATE_LOCATION]: CreateFirstLocation,
};

const AccountSetupPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<SetupPage | null>(null);

  const router = useRouter();
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { data: user, isFetched } = api.user.getByClerkId.useQuery({
    id: clerkUser?.id ?? "",
  });

  const isReady = isLoaded && isFetched && isSignedIn;

  useEffect(() => {
    if (isReady && user?.companyId != null && (currentPage === SetupPage.CREATE_COMPANY)) {
      router.push("/dashboard").catch((e) => console.log(e));
      return;
    }
  });

  useEffect(() => {
    if (isReady && currentPage == null) {
      setCurrentPage(SetupPage.CREATE_COMPANY);
    }
  }, [isReady, currentPage]);

  if (!isReady || currentPage == null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const CurrentSetupPage = setupPages[currentPage];

  return (
    <SignedIn>
      <div className="flex h-full min-h-screen items-center justify-center py-2">
        <div className="container mx-auto max-w-2xl rounded-md border border-gray-200 bg-white p-4 drop-shadow">
          <CurrentSetupPage setCurrentPage={setCurrentPage} user={user} />
        </div>
      </div>
    </SignedIn>
  );
};

export default AccountSetupPage;

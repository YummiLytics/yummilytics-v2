import type { ComponentType } from "react";
import { useState } from "react";
import type { NextPage } from "next";
import CompanyCreationPage from "./CompanyCreationPage";
import CreateLocation from "./CreateLocation";

type SetupFormPageProps = {
  setCurrentPage: (page: SetupPage) => void;
};

export type SetupFormPage<P = NonNullable<unknown>> = ComponentType<
  SetupFormPageProps & P
>;

export const enum SetupPage {
  CREATE_COMPANY = "CREATE_COMPANY",
  CREATE_LOCATION = "CREATE_LOCATION"
}

const AccountSetupPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<SetupPage>(
    SetupPage.CREATE_COMPANY
  );

  const setupPages: { [P in SetupPage]: SetupFormPage } = {
    [SetupPage.CREATE_COMPANY]: CompanyCreationPage,
    [SetupPage.CREATE_LOCATION]: CreateLocation
  };

  const CurrentSetupPage = setupPages?.[currentPage] ?? null;

  return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <div className="container mx-auto mt-10 max-w-2xl rounded-md border border-gray-200 bg-white p-4 drop-shadow">
        <CurrentSetupPage setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default AccountSetupPage;

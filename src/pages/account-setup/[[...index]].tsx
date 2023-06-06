import type { ComponentType } from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import OrganizationCreation from "./OrganizationCreation";
import InputField from "~/components/InputField";

type SetupFormPageProps = {
  setCurrentPage: (page: SetupPage) => void;
};

export type SetupFormPage<P = NonNullable<unknown>> = ComponentType<
  SetupFormPageProps & P
>;

export const enum SetupPage {
  CREATE_ORGANIZATION = "CREATE_ORGANIZATION",
}

export const inputNames = {
  repFirstName: "repFirstName",
  repLastName: "repLastName",
  repPhone: "repPhone",
  companyName: "companyName",
  companyAddress: "companyAddress",
  companyCity: "companyCity",
  companyState: "companyState",
  companyZip: "companyZip",
} as const;

export type AccountFormInputs = {
  [inputNames.repFirstName]: string;
  [inputNames.repLastName]: string;
  [inputNames.repPhone]: string;
  [inputNames.companyName]: string;
  [inputNames.companyAddress]: string;
  [inputNames.companyCity]: string;
  [inputNames.companyState]: string;
  [inputNames.companyZip]: string | number;
};

export const AccountInputField = InputField<AccountFormInputs>;

const AccountSetupPage: NextPage = () => {
  const accountSetupForm = useForm<AccountFormInputs>({ mode: "onBlur" });
  const { handleSubmit } = accountSetupForm;

  const [currentPage, setCurrentPage] = useState<SetupPage>(
    SetupPage.CREATE_ORGANIZATION
  );

  const setupPages: { [P in SetupPage]: SetupFormPage } = {
    [SetupPage.CREATE_ORGANIZATION]: OrganizationCreation,
  };

  const CurrentSetupPage = setupPages?.[currentPage] ?? null;

  const onSubmit = (values: AccountFormInputs) => {
    console.log(values);
  };

  return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <div className="container mx-auto mt-10 max-w-2xl rounded-md border border-gray-200 bg-white p-4 drop-shadow">
        <FormProvider {...accountSetupForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CurrentSetupPage setCurrentPage={setCurrentPage}/>
            <button>Submit</button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AccountSetupPage;

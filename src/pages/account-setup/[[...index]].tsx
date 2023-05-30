import type { ComponentType } from "react";
import { useState } from "react";
import type { NextPage } from "next";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import OrganizationCreation from "./OrganizationCreation";

type SetupFormPageProps = {
  setCurrentPage: (page: SetupPage) => void
  form: UseFormReturn<FieldValues>
}

export type SetupFormPage<P = NonNullable<unknown>> = ComponentType<SetupFormPageProps & P>

export const enum SetupPage {
  CREATE_ORGANIZATION = "CREATE_ORGANIZATION"
}

const setupPages: {[P in SetupPage]: SetupFormPage} = {
  [SetupPage.CREATE_ORGANIZATION]: OrganizationCreation,
}

const AccountSetupPage: NextPage = () => {

  const accountSetupForm = useForm()
  const { register, handleSubmit, watch } = accountSetupForm;
  
  const [currentPage, setCurrentPage] = useState<SetupPage>(SetupPage.CREATE_ORGANIZATION)

  const CurrentSetupPage = (props: SetupFormPageProps & {page: SetupPage}) => {
    const { page, setCurrentPage, form} = props;
    const CurrentPage = setupPages?.[page] ?? null
    return <CurrentPage form={form} setCurrentPage={setCurrentPage}/>
  }

  return (
    <div>
      <div className="container">
        <CurrentSetupPage page={currentPage} setCurrentPage={setCurrentPage} form={accountSetupForm}/>
      </div>
    </div>
  )
}

export default AccountSetupPage;

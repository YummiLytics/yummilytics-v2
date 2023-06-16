import React from "react";
import { type SetupFormPage } from "./[[...index]]";
import InputField from "~/components/InputField";
import states from "~/static/state-codes";
import { z } from "zod";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { CompanySchemaType } from "~/types/schemas";
import { useUser } from "@clerk/nextjs";

const nameRegex = /^[a-zA-Z]+((-|\s)([a-zA-Z])+)*?$/gm;
const phoneRegex =
  /^(1|\+1)?(?:-|\s)?\(?(\d{3})\)?(?:\s|-)?(\d{3})(?:-|\s)?(\d{4})$/;

const inputNames = {
  repFirstName: "repFirstName",
  repLastName: "repLastName",
  repPhone: "repPhone",
  companyName: "companyName",
  companyAddress: "companyAddress",
  companyCity: "companyCity",
  companyState: "companyState",
  companyZip: "companyZip",
} as const;

const companyFormSchema = z.object({
  [inputNames.repFirstName]: z
    .string()
    .min(1, "Please enter a first name")
    .max(100)
    .regex(nameRegex, "Please enter a valid first name"),
  [inputNames.repLastName]: z
    .string()
    .min(1, "Please enter a last name")
    .max(100)
    .regex(nameRegex, "Please enter a valid last name"),
  [inputNames.repPhone]: z
    .string()
    .min(1, "Please enter a phone number")
    .regex(phoneRegex, "Please enter a valid phone number"),
  [inputNames.companyName]: z
    .string()
    .min(1, "Please enter the name of your organization")
    .max(100),
  [inputNames.companyAddress]: z
    .string()
    .min(1, "Please enter an address for your organization")
    .max(100),
  [inputNames.companyCity]: z
    .string()
    .min(1, "Please enter a city for your organization")
    .max(100),
  [inputNames.companyState]: z
    .string()
    .length(2, "Please choose a state for your organization"),
  [inputNames.companyZip]: z
    .string()
    .length(5, "Please enter a 5-digit ZIP code")
    .regex(/^\d+$/, "Please enter a valid ZIP code")
    .transform((val) => parseInt(val)),
});

type CompanyFormInputs = z.infer<typeof companyFormSchema>;

type NewCompany = Omit<CompanySchemaType, "id">

const CompanyInputField = InputField<CompanyFormInputs>;

const PersonalInfo = () => (
  <div>
    <h2 className="mb-4 text-center text-lg font-bold text-gray-600">
      Tell Us About You
    </h2>
    <div className="mx-auto flex flex-col gap-4">
      <div className="flex w-full gap-8">
        <CompanyInputField
          name={inputNames.repFirstName}
          label="First Name"
          className="flex-1"
        />
        <CompanyInputField
          name={inputNames.repLastName}
          label="Last Name"
          className="flex-1"
        />
      </div>
      <div>
        <CompanyInputField
          name={inputNames.repPhone}
          label="Phone Number"
          type="tel"
        />
      </div>
    </div>
  </div>
);

const CompanyInfo = () => (
  <div>
    <h2 className="mb-4 text-center text-lg font-bold text-gray-600">
      Tell Us About Your Company
    </h2>
    <div className="mx-auto flex flex-col gap-4">
      <CompanyInputField name={inputNames.companyName} label="Company Name" />
      <CompanyInputField name={inputNames.companyAddress} label="Address" />
      <div className="flex gap-4">
        <CompanyInputField
          name={inputNames.companyCity}
          label="City"
          className="flex-1"
        />
        <CompanyInputField
          name={inputNames.companyState}
          label="State"
          type="select"
          defaultValue="CO"
          className="w-2/12 min-w-fit"
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </CompanyInputField>
        <CompanyInputField
          name={inputNames.companyZip}
          label="ZIP"
          className="w-3/12"
        />
      </div>
    </div>
  </div>
);

const CompanyCreationPage: SetupFormPage = (props) => {
  const { setCurrentPage } = props;
  const companyForm = useForm<CompanyFormInputs>({
    mode: "onBlur",
    resolver: zodResolver(companyFormSchema),
  });
  const { user } = useUser();

  const createCompanyMutation = api.companies.create
    .useMutation({
      onSuccess: (res) => {
        console.log("Success!", res);
        //setCurrentPage(SetupPage)
      },
      onError: (e) => {
        console.log("Error!", e);
      },
    });

  const mapValues = (values: CompanyFormInputs): NewCompany => ({
      name: values.companyName,
      buildingNumber: values.companyAddress
        .substring(0, values.companyAddress.indexOf(" "))
        .trim(),
      street: values.companyAddress
        .substring(
          values.companyAddress.indexOf(" ") + 1,
          values.companyAddress.length
        )
        .trim(),
      city: values.companyCity,
      state: values.companyState,
      zip: values.companyZip.toString(),
      repFirstName: values.repFirstName,
      repLastName: values.repLastName,
      repEmail: user?.primaryEmailAddress?.toString() || "",
      repPhone: values.repPhone,
    })

  const onSubmit: SubmitHandler<CompanyFormInputs> = (values) => {
    const mappedValues = mapValues(values);
    createCompanyMutation.mutate(mappedValues);
  };

  return (
    <>
      <div className="mx-auto flex w-11/12 flex-col gap-8 md:p-8">
        <FormProvider {...companyForm}>
          <form onSubmit={companyForm.handleSubmit(onSubmit)}>
            <PersonalInfo />
            <CompanyInfo />
            <button>Submit</button>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default CompanyCreationPage;

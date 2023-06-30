import React from "react";
import { type SetupFormPage } from "./[[...index]]";
import FormInput from "~/components/form/FormInput";
import states from "~/static/state-codes";
import { z } from "zod";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import type { CompanyType } from "~/types";
import { useUser } from "@clerk/nextjs";
import FormSelect from "~/components/form/FormSelect";
import { SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Toast } from "~/components/ui/toast";

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

type NewCompany = Omit<CompanyType, "id">;

const CompanyFormInput = FormInput<CompanyFormInputs>;

const PersonalInfo = () => (
  <section>
    <h2 className="mb-4 text-center text-lg font-bold text-gray-600">
      Tell Us About You
    </h2>
    <div className="mx-auto flex flex-col gap-4">
      <div className="flex w-full gap-8">
        <CompanyFormInput
          name={inputNames.repFirstName}
          label="First Name"
          className="flex-1"
        />
        <CompanyFormInput
          name={inputNames.repLastName}
          label="Last Name"
          className="flex-1"
        />
      </div>
      <div>
        <CompanyFormInput
          name={inputNames.repPhone}
          label="Phone Number"
          type="tel"
        />
      </div>
    </div>
  </section>
);

const CompanyInfo = () => (
  <section>
    <h2 className="mb-4 text-center text-lg font-bold text-gray-600">
      Tell Us About Your Company
    </h2>
    <div className="mx-auto flex flex-col gap-4">
      <CompanyFormInput name={inputNames.companyName} label="Company Name" />
      <CompanyFormInput name={inputNames.companyAddress} label="Address" />
      <div className="flex gap-4">
        <CompanyFormInput
          name={inputNames.companyCity}
          label="City"
          className="flex-1"
        />
        <FormSelect<CompanyFormInputs>
          name={inputNames.companyState}
          label="State"
          defaultValue="CO"
          className="w-2/12 min-w-fit"
        >
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </FormSelect>
        <CompanyFormInput
          name={inputNames.companyZip}
          label="ZIP"
          className="w-2/12"
        />
      </div>
    </div>
  </section>
);

const CompanyCreationPage: SetupFormPage = (props) => {
  const { setCurrentPage } = props;
  const companyForm = useForm<CompanyFormInputs>({
    mode: "onBlur",
    resolver: zodResolver(companyFormSchema),
  });
  const { user } = useUser();
  const { toast } = useToast();

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
  });

  const createCompanyMutation = api.companies.create.useMutation({
    onSuccess: (res) => {
      console.log("Success!", res);
      //setCurrentPage(SetupPage)
    },
    onError: (e) => {
      console.log("Error!", e);
    },
  });

  const onSubmit: SubmitHandler<CompanyFormInputs> = (values) => {
    const mappedValues = mapValues(values);
    createCompanyMutation.mutate(mappedValues);
  };

  return (
    <FormProvider {...companyForm}>
      <form onSubmit={companyForm.handleSubmit(onSubmit)}>
        <div className="mx-auto flex w-11/12 flex-col gap-8 md:p-8">
          <PersonalInfo />
          <CompanyInfo />
          <Button
            className="self-end"
            onClick={() => {
              toast({
                title: "Success!",
                description: "Successfully created your company.",
                duration: 2000
              });
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CompanyCreationPage;

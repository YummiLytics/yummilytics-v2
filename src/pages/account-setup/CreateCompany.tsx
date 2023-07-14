import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { type CompanyType, type SetupFormPage } from "~/types";
import { SetupPage } from "~/types/enums";
import FormSelect from "~/components/form/FormSelect";
import FormInput from "~/components/form/FormInput";
import { SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import states from "~/static/state-codes"

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
    <h2 className="mb-4 text-center text-lg font-bold text-sky-700">
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

const CompanyInfo = () => {
  return (
    <section>
      <h2 className="mb-4 text-center text-lg font-bold text-sky-700">
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
};

const CreateCompany: SetupFormPage = (props) => {
  const { setCurrentPage, user, userData } = props;

  const companyForm = useForm<CompanyFormInputs>({
    mode: "onBlur",
    resolver: zodResolver(companyFormSchema),
  });

  const { toast } = useToast();
  const ctx = api.useContext();

  const createDBUser = api.user.create.useMutation({
    onSuccess: () => {
      void ctx.user.invalidate();
    },
  });

  const createCompanyMutation = api.companies.create.useMutation();

  const assignCompany = api.user.assignCompanyId.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully created your company.",
        duration: 3000,
        variant: "success",
      });
      setCurrentPage(SetupPage.CREATE_LOCATION);
    },
    onError: (e) => {
      console.log("Error!", e);
      toast({
        title: "There was a problem...",
        description:
          "There was an issue setting up your company. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });

  const mapValues = (values: CompanyFormInputs): NewCompany => ({
    name: values.companyName,
    buildingNumber: values.companyAddress
      .trim()
      .substring(0, values.companyAddress.indexOf(" "))
      .trim(),
    street: values.companyAddress
      .trim()
      .substring(
        values.companyAddress.indexOf(" ") + 1,
        values.companyAddress.length
      ),
    city: values.companyCity,
    state: values.companyState,
    zip: values.companyZip.toString(),
    repFirstName: values.repFirstName,
    repLastName: values.repLastName,
    repEmail: user?.primaryEmailAddress?.toString() || "",
    repPhone: values.repPhone,
  });

  const onSubmit: SubmitHandler<CompanyFormInputs> = async (values) => {
    const mappedValues = mapValues(values);

    const newUser =
      userData ?? (await createDBUser.mutateAsync({ clerkId: user.id }));
    const newCompany = await createCompanyMutation.mutateAsync(mappedValues);

    assignCompany.mutate({ userId: newUser.id, companyId: newCompany.id });
  };

  return (
    <FormProvider {...companyForm}>
      <form onSubmit={companyForm.handleSubmit(onSubmit)}>
        <div className="mx-auto flex flex-col gap-8 md:p-8">
          <PersonalInfo />
          <CompanyInfo />
          <Button className="w-2/12 self-end">Next</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateCompany;

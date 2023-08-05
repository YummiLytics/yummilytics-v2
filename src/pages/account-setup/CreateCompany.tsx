import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import type { Must, SetupFormPage } from "~/types";
import { SetupPage } from "~/types/enums";
import FormSelect from "~/components/form/FormSelect";
import FormInput from "~/components/form/FormInput";
import { SelectItem } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import states from "~/static/state-codes";
import { useUser } from "@clerk/nextjs";
import { type Company } from "@prisma/client";

type CompanyFormInputs = z.infer<typeof companyFormSchema>;
type NewCompany = Must<Omit<Company, "id">>;

const nameRegex = /^[a-zA-Z]+((-|\s)([a-zA-Z])+)*?$/gm;
const phoneRegex =
  /^(1|\+1)?(?:-|\s)?\(?(\d{3})\)?(?:\s|-)?(\d{3})(?:-|\s)?(\d{4})$/;

const companyFormSchema = z.object({
  repFirstName: z
    .string()
    .min(1, "Please enter a first name")
    .max(100)
    .regex(nameRegex, "Please enter a valid first name"),
  repLastName: z
    .string()
    .min(1, "Please enter a last name")
    .max(100)
    .regex(nameRegex, "Please enter a valid last name"),
  repPhone: z
    .string()
    .min(1, "Please enter a phone number")
    .regex(phoneRegex, "Please enter a valid phone number"),
  name: z
    .string()
    .min(1, "Please enter the name of your organization")
    .max(100),
  address: z
    .string()
    .min(1, "Please enter an address for your organization")
    .max(100),
  addressSecondary: z.string().max(100),
  city: z.string().min(1, "Please enter a city for your organization").max(100),
  state: z.string().length(2, "Please choose a state for your organization"),
  zip: z
    .string()
    .length(5, "Please enter a 5-digit ZIP code")
    .regex(/^\d+$/, "Please enter a valid ZIP code")
    .transform((val) => parseInt(val)),
});

const CompanyInput = FormInput<CompanyFormInputs>;

const PersonalInfo = () => (
  <section>
    <h2 className="mb-4 text-center text-lg font-bold text-sky-700">
      Tell Us About You
    </h2>
    <div className="mx-auto flex flex-col gap-4">
      <div className="flex w-full gap-8">
        <CompanyInput
          name="repFirstName"
          label="First Name"
          className="flex-1"
        />
        <CompanyInput name="repLastName" label="Last Name" className="flex-1" />
      </div>
      <div>
        <CompanyInput name="repPhone" label="Phone Number" type="tel" />
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
        <CompanyInput name="name" label="Company Name" />
        <CompanyInput name="address" label="Address" />
        <CompanyInput
          name="addressSecondary"
          label="Address Line 2 (Optional)"
        />
        <div className="flex gap-4">
          <CompanyInput name="city" label="City" className="flex-1" />
          <FormSelect<CompanyFormInputs>
            name="state"
            label="State"
            className="w-2/12 min-w-fit"
          >
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </FormSelect>
          <CompanyInput name="zip" label="ZIP" className="w-2/12" />
        </div>
      </div>
    </section>
  );
};

const CreateCompany: SetupFormPage = (props) => {
  const { setCurrentPage, user: userData } = props;
  const { user, isSignedIn } = useUser();

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

  const assignCompany = api.user.assignCompanyId.useMutation();

  if (!isSignedIn) {
    return null;
  }

  const mapValues = (values: CompanyFormInputs): NewCompany => ({
    ...values,
    buildingNumber: values.address
      .trim()
      .substring(0, values.address.indexOf(" "))
      .trim(),
    street: values.address
      .trim()
      .substring(values.address.indexOf(" ") + 1, values.address.length)
      .concat(
        !!values.addressSecondary.trim() ? ", " : "",
        values.addressSecondary.trim()
      ),
    zip: values.zip.toString(),
    repEmail: user.primaryEmailAddress?.emailAddress || "",
  });

  const onSubmit: SubmitHandler<CompanyFormInputs> = async (values) => {
    const mappedValues = mapValues(values);

    const newUser =
      userData ?? (await createDBUser.mutateAsync({ clerkId: user.id }));
    const newCompany = await createCompanyMutation.mutateAsync(mappedValues);

    assignCompany.mutate(
      { userId: newUser.id, companyId: newCompany.id },
      {
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
      }
    );
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

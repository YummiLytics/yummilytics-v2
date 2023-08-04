import React, { useEffect } from "react";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import { SelectItem } from "../ui/select";
import states from "~/static/state-codes";
import { defaultCompany } from "~/types/defaults";
import type { UserWithRelations } from "~/types";
import { type ZodTypeAny } from "zod";
import { type LocationFieldValues } from "../CreateLocation";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateLocationFormProps = {
  user: UserWithRelations;
  schema: ZodTypeAny;
  allValues: Partial<LocationFieldValues>;
  setAllValues: (values: Partial<LocationFieldValues>) => void;
  setStepValid: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateLocationForm = ({
  user,
  schema,
  allValues,
  setAllValues,
  setStepValid,
}: CreateLocationFormProps) => {
  const userCompany = user?.company || defaultCompany;

  const companyAddress = `${userCompany.buildingNumber || ""} ${
    userCompany.street?.split(",").shift()?.trim() || userCompany.street || ""
  }`;
  const companyAddressSecondary =
    userCompany.street?.split(",").slice(1).join(",").trim() || "";

  const locationForm = useForm<LocationFieldValues>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const {
    watch,
    formState: { isDirty, isValid },
  } = locationForm;

  const formValues = watch();

  useEffect(() => {
    setAllValues(formValues);
  }, [formValues, setAllValues]);

  useEffect(() => {
    const checkDirty = isDirty
      ? isDirty
      : schema.safeParse(formValues).success;
    setStepValid(isValid && checkDirty);
  }, [isDirty, isValid, setStepValid, schema, formValues]);

  const LocationInput = FormInput<LocationFieldValues>;
  return (
    <FormProvider {...locationForm}>
      <div className="flex flex-col gap-5 p-4 pt-6">
        <div className="flex gap-4">
          <LocationInput
            name={"name"}
            label="Location Name"
            className="flex-1"
            defaultValue={allValues?.name || userCompany.name || ""}
          />
          <LocationInput
            name={"startYear"}
            type="number"
            label="Year of Establishment"
            className="w-3/12"
            defaultValue={allValues?.startYear}
          />
        </div>
        <LocationInput name={"address"} label="Address" defaultValue={allValues?.address || companyAddress}/>
        <LocationInput
          name={"addressSecondary"}
          label="Address Line 2 (Optional)"
          defaultValue={allValues?.addressSecondary || companyAddressSecondary}
        />
        <div className="flex gap-4">
          <LocationInput name={"city"} label="City" className="flex-1" defaultValue={allValues?.city || userCompany.city || ""}/>
          <FormSelect<LocationFieldValues>
            name={"state"}
            label="State"
            className="w-2/12 min-w-fit"
            defaultValue={allValues?.state || userCompany.state || "CO"}
          >
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </FormSelect>
          <LocationInput name={"zip"} label="ZIP" className="w-2/12" defaultValue={allValues?.zip || userCompany.zip || ""}/>
        </div>
      </div>
    </FormProvider>
  );
};

export default CreateLocationForm;

import React from "react";
import {
  type LocationFormInputs,
  type LocationFormInputNames,
} from "../CreateLocation";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import { SelectItem } from "../ui/select";
import states from "~/static/state-codes";
import { defaultCompany } from "~/types/defaults";
import type { UserWithRelations } from "~/types";

type CreateLocationFormProps = {
  user: UserWithRelations;
  inputs: LocationFormInputNames;
};

const CreateLocationForm = ({ user, inputs }: CreateLocationFormProps) => {

  const userCompany = user?.company || defaultCompany;

  const companyAddress = `${userCompany.buildingNumber || ""} ${
    userCompany.street?.split(",").shift()?.trim() || userCompany.street || ""
  }`;
  const companyAddressSecondary =
    userCompany.street?.split(",").slice(1).join(",").trim() || "";

  const LocationInput = FormInput<LocationFormInputs>;

  return (
    <div className="flex flex-col gap-5 p-4 pt-6">
      <div className="flex gap-4">
        <LocationInput
          name={inputs.name}
          label="Location Name"
          defaultValue={userCompany.name || ""}
          className="flex-1"
        />
        <LocationInput
          name={inputs.startYear}
          type="number"
          label="Year of Establishment"
          className="w-3/12"
        />
      </div>
      <LocationInput
        name={inputs.address}
        label="Address"
        defaultValue={companyAddress}
      />
      <LocationInput
        name={inputs.addressSecondary}
        label="Address Line 2 (Optional)"
        defaultValue={companyAddressSecondary}
      />
      <div className="flex gap-4">
        <LocationInput
          name={inputs.city}
          label="City"
          defaultValue={userCompany.city || ""}
          className="flex-1"
        />
        <FormSelect<LocationFormInputs>
          name={inputs.state}
          label="State"
          defaultValue={userCompany.state || "CO"}
          className="w-2/12 min-w-fit"
        >
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </FormSelect>
        <LocationInput
          name={inputs.zip}
          label="ZIP"
          defaultValue={userCompany.zip || ""}
          className="w-2/12"
        />
      </div>
    </div>
  );
};

export default CreateLocationForm;

import React, { useEffect, useMemo } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { FormProvider, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import FormInput from "./form/FormInput";
import FormSelect from "./form/FormSelect";
import { SelectItem } from "./ui/select";
import { defaultCompany } from "~/types/defaults";
import states from "~/static/state-codes";

type CreateLocationProps = {
  useCompanyDefaults?: boolean;
}
type LocationFieldValues = z.infer<typeof newLocationSchema>;



const newLocationSchema = z.object({
  name: z.string().min(1, "Please enter a location name").max(100),
  startYear: z.coerce
    .number()
    .gte(1900, { message: "Please a choose a year no earlier than 1900" })
    .lte(new Date().getFullYear(), {
      message: "Please choose the current year or a past year.",
    }),
  address: z
    .string()
    .min(1, "Please enter an address for your organization")
    .max(100),
  addressSecondary: z.string().max(100),
  city: z.string().min(1, "Please enter a city for your organization").max(100),
  state: z
    .string()
    .length(2, "Please choose a state for your organization")
    .refine((val) => states.includes(val), {
      message: "Only available states are allowed",
    }),
  zip: z
    .string()
    .length(5, "Please enter a 5-digit ZIP code")
    .regex(/^\d+$/, "Please enter a valid ZIP code"),
  segment: z.number(),
  category: z.number(),
});

const CreateLocation = ({ useCompanyDefaults = false }: CreateLocationProps) => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { data: user, isFetched: isUserFetched } =
    api.user.getByClerkId.useQuery({ id: clerkUser?.id ?? "" });
  const { data: segments } = api.segment.getAll.useQuery();
  const { data: categories } = api.category.getAll.useQuery();

  const userCompany = user?.company || defaultCompany;

  const refinedSchema = useMemo(
    () =>
      newLocationSchema.extend({
        segment: newLocationSchema.shape.segment.refine(
          (segmentId) => segments?.some((seg) => seg.id == segmentId),
          {
            message: "Please choose a valid segment",
          }
        ),
        category: newLocationSchema.shape.category.refine(
          (categoryId) => categories?.some((cat) => cat.id == categoryId),
          { message: "Please choose a valid category" }
        ),
      }),
    [segments, categories]
  );

  const locationForm = useForm<LocationFieldValues>({
    mode: "onBlur",
    resolver: zodResolver(refinedSchema),
  });

  const defaultValues: Omit<LocationFieldValues, "startYear" | "segment" | "category"> = useMemo(() => ({
    name: useCompanyDefaults ? userCompany?.name || "" : "",
    address: useCompanyDefaults ? `${userCompany.buildingNumber || ""} ${userCompany.street?.split(",").shift()?.trim() || userCompany.street || ""}` : "",
    addressSecondary: useCompanyDefaults ? userCompany.street?.split(",").slice(1).join(",").trim() || "" : "",
    city: useCompanyDefaults ? userCompany.city || "" : "",
    state: useCompanyDefaults ? userCompany.state || "" : "",
    zip: useCompanyDefaults ? userCompany.zip || "" : ""
  }), [useCompanyDefaults, userCompany])

  useEffect(() => {
    if (isUserFetched && useCompanyDefaults && !!user?.company) {
      locationForm.reset(defaultValues)
    }
  }, [defaultValues, isUserFetched, locationForm, useCompanyDefaults, user?.company])

  if (!isClerkLoaded || !isUserFetched || !isSignedIn || !user) {
    return null;
  }

  const LocationInput = FormInput<LocationFieldValues>;
  return (
    <FormProvider {...locationForm}>
      <div className="flex flex-col gap-5 p-4 pt-6">
        <div className="flex gap-4">
          <LocationInput
            name={"name"}
            label="Location Name"
            className="flex-1"
            defaultValue={defaultValues.name}
          />
          <LocationInput
            name={"startYear"}
            type="number"
            label="Year of Establishment"
            className="w-3/12"
          />
        </div>
        <LocationInput name={"address"} label="Address" defaultValue={defaultValues.address}/>
        <LocationInput
          name={"addressSecondary"}
          label="Address Line 2 (Optional)"
          defaultValue={defaultValues.addressSecondary}
        />
        <div className="flex gap-4">
          <LocationInput name={"city"} label="City" className="flex-1" defaultValue={defaultValues.city}/>
          <FormSelect<LocationFieldValues>
            name={"state"}
            label="State"
            className="w-2/12 min-w-fit"
            defaultValue={defaultValues.state}
          >
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </FormSelect>
          <LocationInput name={"zip"} label="ZIP" className="w-2/12" defaultValue={defaultValues.zip}/>
        </div>
        <div className="flex gap-4">
          
        </div>
      </div>
    </FormProvider>
  );
};

export default CreateLocation;

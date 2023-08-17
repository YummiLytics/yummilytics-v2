import React, { useEffect, useMemo } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import FormInput from "./form/FormInput";
import FormSelect from "./form/FormSelect";
import { SelectItem } from "./ui/select";
import { defaultCompany } from "~/types/defaults";
import states from "~/static/state-codes";
import { Button } from "./ui/button";
import { type LocationSchema } from "~/types/schemas";

type CreateLocationProps = {
  useCompanyDefaults?: boolean;
};
type LocationFieldValues = z.infer<typeof newLocationSchema>;

const newLocationSchema = z.object({
  name: z.string().min(1, "Please enter a location name").max(100),
  startYear: z.coerce
    .number()
    .gte(1900, { message: "Please a choose a year no earlier than 1900" })
    .lte(new Date().getFullYear(), {
      message: "Please choose the current year or a past year.",
    })
    .transform((value) => new Date(value, 0))
    .pipe(z.date()),
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
  segment: z.coerce.number(),
  category: z.coerce.number(),
});

const CreateLocation = ({
  useCompanyDefaults = false,
}: CreateLocationProps) => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { data: user, isFetched: isUserFetched } =
    api.user.getByClerkId.useQuery({ id: clerkUser?.id ?? "" });
  const { data: segments } = api.segment.getAll.useQuery();

  const userCompany = user?.company ?? defaultCompany;

  const refinedSchema = useMemo(getRefinedSchema, [segments]);

  const locationForm = useForm<LocationFieldValues>({
    mode: "onBlur",
    resolver: zodResolver(refinedSchema),
  });
  const { watch } = locationForm;

  const selectedSegment: number | undefined = watch("segment");

  const defaultValues: Omit<
    LocationFieldValues,
    "startYear" | "segment" | "category"
  > = useMemo(
    () => ({
      name: userCompany?.name || "",
      address: useCompanyDefaults
        ? `${userCompany.buildingNumber || ""} ${
            userCompany.street?.split(",").shift()?.trim() ||
            userCompany.street ||
            ""
          }`
        : "",
      addressSecondary: useCompanyDefaults
        ? userCompany.street?.split(",").slice(1).join(",").trim() || ""
        : "",
      city: useCompanyDefaults ? userCompany.city || "" : "",
      state: useCompanyDefaults ? userCompany.state || "" : "",
      zip: useCompanyDefaults ? userCompany.zip || "" : "",
    }),
    [useCompanyDefaults, userCompany]
  );

  useEffect(() => {
    if (isUserFetched && useCompanyDefaults && !!user?.company) {
      locationForm.reset(defaultValues);
    }
  }, [
    defaultValues,
    isUserFetched,
    locationForm,
    useCompanyDefaults,
    user?.company,
  ]);

  useEffect(() => {
    locationForm.resetField("category");
  }, [locationForm, selectedSegment]);

  function getRefinedSchema() {
    return newLocationSchema
      .extend({
        segment: newLocationSchema.shape.segment.refine(
          (segmentId) => segments?.some((seg) => seg.id == segmentId),
          { message: "Please choose a valid segment" }
        ),
      })
      .refine(
        (data) =>
          segments
            ?.find((seg) => seg.id == data.segment)
            ?.categories.some((cat) => cat?.id == data.category),
        { message: "Please choose a valid category", path: ["category"] }
      );
  }

  function mapValues(
    values: LocationFieldValues
  ): Omit<z.infer<typeof LocationSchema>, "id"> {
    if (!user || !user.companyId) {
      throw new Error("No user or user company id");
    }
    return {
      nickname: values.name,
      companyId: user.companyId,
      index: (user.company?.locations?.length ?? 1).toString(),
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
      city: values.city,
      state: values.state,
      zip: values.zip.toString(),
      segmentId: values.segment,
      categoryId: values.category,
      startDate: values.startYear,
    };
  }

  const onSubmit: SubmitHandler<LocationFieldValues> = (values) => {
    const mappedValues = mapValues(values);
    console.log(mappedValues);
  };

  if (!isClerkLoaded || !isUserFetched || !isSignedIn || !user) {
    return null;
  }

  const LocationInput = FormInput<LocationFieldValues>;
  const LocationSelect = FormSelect<LocationFieldValues>;
  return (
    <FormProvider {...locationForm}>
      <form onSubmit={locationForm.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 p-4">
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
          <LocationInput
            name={"address"}
            label="Address"
            defaultValue={defaultValues.address}
          />
          <LocationInput
            name={"addressSecondary"}
            label="Address Line 2 (Optional)"
            defaultValue={defaultValues.addressSecondary}
          />
          <div className="flex gap-4">
            <LocationInput
              name={"city"}
              label="City"
              className="flex-1"
              defaultValue={defaultValues.city}
            />
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
            <LocationInput
              name={"zip"}
              label="ZIP"
              className="w-2/12"
              defaultValue={defaultValues.zip}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <LocationSelect
                name="segment"
                label="Segment"
                placeholder="Select a Segment"
                className="w-full"
              >
                {segments?.map((segment) => (
                  <SelectItem key={segment.id} value={`${segment.id}`}>
                    {segment.name}
                  </SelectItem>
                ))}
              </LocationSelect>
            </div>
            <div className="flex-1">
              {!!selectedSegment && (
                <LocationSelect
                  name="category"
                  label="Category"
                  defaultValue={""}
                  placeholder="Select a Category"
                  className="w-full"
                >
                  {segments
                    ?.find((seg) => seg.id == selectedSegment)
                    ?.categories?.map((cat) => (
                      <SelectItem
                        key={cat?.id ?? ""}
                        value={`${cat?.id ?? ""}`}
                      >
                        {cat?.name ?? ""}
                      </SelectItem>
                    ))}
                </LocationSelect>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled={!locationForm.formState.isValid}>Create</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateLocation;

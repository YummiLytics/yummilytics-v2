import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import availableStates from "~/static/state-codes";
import { api } from "~/utils/api";
import MultiStepper, {
  useMultiStepperState,
  createSteps,
} from "./ui/mutlistepper";
import { Button } from "./ui/button";
import CreateLocationForm from "./CreateLocation/CreateLocationForm";
import { useUser } from "@clerk/nextjs";

export type LocationFormInputs = z.infer<typeof newLocationFormSchema>;
export type LocationFormInputNames = typeof locationInputs;

const locationInputs = {
  name: "locationName",
  startYear: "locationStartYear",
  address: "locationAddress",
  addressSecondary: "locationAddressSecondary",
  city: "locationCity",
  state: "locationState",
  zip: "locationZip",
  segment: "locationSegment",
  category: "locationCategory",
  zipGroup: "locationZipGroup",
  customGroup: "locationCustomGroup",
} as const;

const newLocationFormSchema = z.object({
  [locationInputs.name]: z
    .string()
    .min(1, "Please enter a location name")
    .max(100),
  [locationInputs.startYear]: z.coerce
    .number()
    .gte(1900, { message: "Please a choose a year no earlier than 1900" })
    .lte(new Date().getFullYear(), {
      message: "Please choose the current year or a past year.",
    }),
  [locationInputs.address]: z
    .string()
    .min(1, "Please enter an address for your organization")
    .max(100),
  [locationInputs.addressSecondary]: z
    .string()
    .min(1, "Please enter an address for your organization")
    .max(100),
  [locationInputs.city]: z
    .string()
    .min(1, "Please enter a city for your organization")
    .max(100),
  [locationInputs.state]: z
    .string()
    .length(2, "Please choose a state for your organization")
    .refine((val) => availableStates.includes(val), {
      message: "Only available states are allowed",
    }),
  [locationInputs.zip]: z
    .string()
    .length(5, "Please enter a 5-digit ZIP code")
    .regex(/^\d+$/, "Please enter a valid ZIP code"),
  [locationInputs.segment]: z.number(),
  [locationInputs.category]: z.number(),
  [locationInputs.zipGroup]: z.array(
    z
      .string()
      .length(5, "Please enter a 5-digit ZIP code")
      .regex(/^\d+$/, "Please enter a valid ZIP code")
  ),
  [locationInputs.customGroup]: z.array(z.number()),
});

const useCreateLocationResolver = () => {
  const createResolver = useCallback(() => {
    const { data: segments } = api.segment.getAll.useQuery();
    const { data: categories } = api.category.getAll.useQuery();

    const refinedSchema = newLocationFormSchema
      .refine(
        (values) =>
          segments?.some((seg) => seg.id == values[locationInputs.segment]),
        { message: "Please choose a valid segment" }
      )
      .refine(
        (values) =>
          categories?.some((cat) => cat.id == values[locationInputs.category]),
        { message: "Please choose a valid category" }
      );

    return zodResolver(refinedSchema);
  }, []);
  return createResolver();
};

const CreateLocation = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { data: user, isFetched: isUserFetched } =
    api.user.getByClerkId.useQuery({ id: clerkUser?.id ?? "" });

  const { step, setStep, nextStep, prevStep, hasPrev, hasNext } =
    useMultiStepperState();
  const resolver = useCreateLocationResolver();

  const locationForm = useForm<LocationFormInputs>({
    mode: "onBlur",
    resolver,
  });

  const onSubmit: SubmitHandler<LocationFormInputs> = (values) => {
    console.log(values);
  };

  if (!isClerkLoaded || !isUserFetched || !isSignedIn || !user) {
    return null;
  }

  const steps = createSteps([
    {
      title: "Location Information",
      component: <CreateLocationForm user={user} inputs={locationInputs} />,
    },
    { title: "Category & Zip Codes", component: <span>Step 2</span> },
    { title: "Custom Benchmark Group", component: <span>Step 3</span> },
  ]);

  return (
    <FormProvider {...locationForm}>
      <form onSubmit={locationForm.handleSubmit(onSubmit)}>
        <MultiStepper step={step} setStep={setStep}>
          {steps}
        </MultiStepper>
        <div className="flex w-full justify-between">
          <span>
            {hasPrev() && <Button onClick={() => prevStep()}>Back</Button>}
          </span>
          <span>
            {hasNext(steps) && (
              <Button onClick={() => nextStep(steps.length)}>Next</Button>
            )}
          </span>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateLocation;

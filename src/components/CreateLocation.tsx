import React, { useEffect, useMemo, useRef, useState } from "react";
import z from "zod";
import availableStates from "~/static/state-codes";
import { api } from "~/utils/api";
import MultiStepper, {
  useMultiStepperState,
  createSteps,
} from "./ui/mutlistepper";
import { Button } from "./ui/button";
import CreateLocationForm from "./CreateLocation/CreateLocationForm";
import { useUser } from "@clerk/nextjs";
import type { UseFormReturn } from "react-hook-form";
import _ from "lodash";

export type LocationFieldValues = z.infer<typeof newLocationSchema>;

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
    .refine((val) => availableStates.includes(val), {
      message: "Only available states are allowed",
    }),
  zip: z
    .string()
    .length(5, "Please enter a 5-digit ZIP code")
    .regex(/^\d+$/, "Please enter a valid ZIP code"),
  segment: z.number(),
  category: z.number(),
  zipGroup: z.array(
    z
      .string()
      .length(5, "Please enter a 5-digit ZIP code")
      .regex(/^\d+$/, "Please enter a valid ZIP code")
  ),
  customGroup: z.array(z.number()),
});

const CreateLocation = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { data: user, isFetched: isUserFetched } =
    api.user.getByClerkId.useQuery({ id: clerkUser?.id ?? "" });
  const { data: segments } = api.segment.getAll.useQuery();
  const { data: categories } = api.category.getAll.useQuery();

  const [isStepValid, setStepValid] = useState<boolean>(false);
  const [allValues, setAllValues] = useState<Partial<LocationFieldValues>>({});

  const { step, setStep, nextStep, prevStep, hasPrev, hasNext } =
    useMultiStepperState();

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
        zipGroup: newLocationSchema.shape.zipGroup,
        customGroup: newLocationSchema.shape.customGroup,
      }),
    [segments, categories]
  );

  const subSchemas = useMemo(
    () => ({
      locationFormSchema: refinedSchema.omit({
        segment: true,
        category: true,
        zipGroup: true,
        customGroup: true,
      }),
      mainGroupsSchema: refinedSchema.pick({
        segment: true,
        category: true,
        zipGroup: true,
      }),
      customGroupSchema: refinedSchema.pick({
        customGroup: true,
      }),
    }),
    [refinedSchema]
  );

  function setFormValues(newValues: Partial<LocationFieldValues>) {
    const values = {...allValues, ...newValues}
    if (!_.isEqual(allValues, values)) {
      setAllValues(values)
    }
  }

  function goNext() {
    if (isStepValid) {
      nextStep();
    }
  }

  if (!isClerkLoaded || !isUserFetched || !isSignedIn || !user) {
    return null;
  }

  const steps = createSteps([
    {
      title: "Location Information",
      component: (
        <CreateLocationForm
          user={user}
          schema={subSchemas.locationFormSchema}
          allValues={allValues}
          setAllValues={setFormValues}
          setStepValid={setStepValid}
        />
      ),
    },
    { title: "Category & Zip Codes", component: <span>Step 2</span> },
    { title: "Custom Benchmark Group", component: <span>Step 3</span> },
  ]);

  return (
    <div>
      <MultiStepper step={step} setStep={setStep}>
        {steps}
      </MultiStepper>
      <div className="flex w-full justify-between">
        <span>
          {hasPrev() && <Button onClick={() => prevStep()}>Back</Button>}
        </span>
        <span>
          {hasNext(steps) && <Button onClick={goNext} disabled={!isStepValid}>Next</Button>}
        </span>
      </div>
    </div>
  );
};

export default CreateLocation;

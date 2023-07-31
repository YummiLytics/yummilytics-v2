import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import availableStates from "~/static/state-codes";
import { api } from "~/utils/api";
import MultiStepper, { Step, useMultiStepperState } from "./ui/mutlistepper";
import { Button } from "./ui/button";

type LocationFormInputs = z.infer<typeof newLocationFormSchema>;

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
  [locationInputs.startYear]: z.number().gt(1900).lte(new Date().getFullYear()),
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
  const { step, setStep, nextStep, prevStep } = useMultiStepperState()
  const resolver = useCreateLocationResolver();

  const locationForm = useForm<LocationFormInputs>({
    mode: "onBlur",
    resolver,
  });

  const onSubmit: SubmitHandler<LocationFormInputs> = (values) => {
    console.log(values)
  }

  return (
    <FormProvider {...locationForm}>
      <form onSubmit={locationForm.handleSubmit(onSubmit)}>
        <MultiStepper step={step} setStep={setStep}>
          <Step title="Location Information">
            Step 1
          </Step>
          <Step title="Category & Zip Codes">
            Step 2
          </Step>
          <Step title="Custom Benchmark Group">
            Step 3
          </Step>
        </MultiStepper>
      </form>
    </FormProvider>
  )};

export default CreateLocation;

import React, { Fragment, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type StepObject = { title: string; component: React.ReactNode };

type StepProps = {
  title: string;
  order?: number;
  children?: React.ReactNode | React.ReactNode[];
};

type MultiStepperProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  showTitles?: boolean;
  disableAutoState?: boolean;
  children:
    | React.ReactElement<StepProps, React.JSXElementConstructor<StepProps>>
    | React.ReactElement<StepProps, React.JSXElementConstructor<StepProps>>[];
};

export const useMultiStepperState = () => {
  const [step, setStep] = useState(0);

  function nextStep(
    numOfSteps?: number | StepObject[] | React.ReactElement<StepProps>[]
  ) {
    if (numOfSteps == null) {
      setStep(step + 1);
      return;
    }

    if (hasNext(numOfSteps)) {
      setStep(step + 1);
    }
  }

  function prevStep(noCheck?: boolean) {
    if (noCheck) {
      setStep(step - 1);
      return;
    }

    if (hasPrev()) {
      setStep(step - 1);
    }
  }

  function hasNext(
    numOfSteps: number | StepObject[] | React.ReactElement<StepProps>[]
  ) {
    if (Array.isArray(numOfSteps)) {
      return step < numOfSteps.length - 1;
    } else {
      return step < numOfSteps - 1;
    }
  }

  function hasPrev() {
    return step > 0;
  }

  return { step, setStep, nextStep, prevStep, hasNext, hasPrev };
};

export const createSteps = (steps: StepObject[]) => {
  return steps.map((step, index) => (
    <Step key={index} title={step.title}>
      {step.component}
    </Step>
  ));
};

export const Step = ({ children }: StepProps) => <>{children}</>;

const MultiStepper = (props: MultiStepperProps) => {
  const {
    step = 0,
    setStep,
    children,
    showTitles = false,
    disableAutoState = false,
  } = props;
  const allSteps = !Array.isArray(children)
    ? [children]
    : [...children].sort(
        (a, b) => (a.props?.order ?? 0) - (b.props?.order ?? 0)
      );

  const currentStep =
    step < 0
      ? 0
      : allSteps.length > 0 && step >= allSteps.length
      ? allSteps.length - 1
      : step;

  useEffect(() => {
    if (step !== currentStep && !disableAutoState) {
      setStep(currentStep);
    }
  }, [step, setStep, currentStep, children, disableAutoState]);

  const stepComponent = allSteps[currentStep];
  const title = stepComponent?.props.title;

  return (
    <div>
      {showTitles && (
        <h2 className="mb-2 text-center text-slate-700">{title}</h2>
      )}
      <div className="flex items-center justify-center">
        {allSteps.map((_s, index) => {
          return (
            <Fragment key={index}>
              {index != 0 && (
                <span
                  className={cn(
                    "mx-2 h-0 w-16 rounded border-2 border-slate-300",
                    currentStep >= index && "border-green-600"
                  )}
                ></span>
              )}
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-300 text-sm text-slate-400",
                  currentStep > index && "border-green-500 text-green-700",
                  currentStep == index &&
                    "border-sky-500 font-bold text-sky-700"
                )}
              >
                {index + 1}
              </span>
            </Fragment>
          );
        })}
      </div>
      <div key={currentStep}>{stepComponent}</div>
    </div>
  );
};

export default MultiStepper;

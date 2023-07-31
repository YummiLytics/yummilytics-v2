import React, { Fragment, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type StepProps = {
  title: string;
  order?: number;
  children?: React.ReactNode | React.ReactNode[];
};

type MultiStepperProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  children:
    | React.ReactElement<StepProps, React.JSXElementConstructor<StepProps>>
    | React.ReactElement<StepProps, React.JSXElementConstructor<StepProps>>[];
};

export const useMultiStepperState = () => {
  const [step, setStep] = useState(0);

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  return { step, setStep, nextStep, prevStep };
};

export const Step = ({ children }: StepProps) => <>{children}</>;

const MultiStepper = ({ step = 0, setStep, children }: MultiStepperProps) => {
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
    if (step !== currentStep) {
      setStep(currentStep);
    }
  }, [step, setStep, currentStep, children]);

  return (
    <div>
      <div className="flex items-center justify-center">
        {allSteps.map((_s, index) => {
          return (
            <Fragment key={index}>
              {index != 0 && (
                <span className="mx-2 h-0 w-16 rounded border-2 border-slate-300"></span>
              )}
              <span
                className={cn(
                  "text-slate-600 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
                  index == currentStep ? "border-2 border-green-500" : "border-2 border-slate-300"
                )}
              >
                {index + 1}
              </span>
            </Fragment>
          );
        })}
      </div>
      <div key={currentStep}>{allSteps[currentStep]}</div>
    </div>
  );
};

export default MultiStepper;

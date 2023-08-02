import React from "react";
import type { FieldValues, Path, ValidationRule } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type FormInputProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  type?: string;
  label?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  required?: string | ValidationRule<boolean>;
  readOnly?: boolean;
  disabled?: boolean;
  hideErrors?: boolean;
  options?: Record<string, unknown>;
  className?: string;
  innerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
};

const FormInput = <TFieldValues extends FieldValues = FieldValues>(
  props: FormInputProps<TFieldValues>
) => {
  const {
    name,
    type = "text",
    label,
    value,
    defaultValue,
    required = false,
    readOnly = false,
    disabled = false,
    hideErrors = false,
    className,
    labelClassName,
    innerClassName,
    errorClassName,
  } = props;

  const formContext = useFormContext<TFieldValues>();

  if (formContext === null) {
    throw Error(
      "You must use a FormProvider so FormInput can get the form context with useFormContext"
    );
  }

  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const options = { required, ...props.options };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "mb-1 block text-sm font-semibold text-gray-600",
            labelClassName
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      <Input
        {...register(name, options)}
        type={type}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={!!errors?.[name]}
        readOnly={readOnly}
        disabled={disabled}
        className={innerClassName}
      />
      {errors?.[name] && !hideErrors && (
        <p
          className={cn(
            "w-0 min-w-full pt-0.5 text-xs text-red-600",
            errorClassName
          )}
        >
          {errors?.[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default FormInput;

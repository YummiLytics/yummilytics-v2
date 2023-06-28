import React from "react";
import type { FieldValues, Path, ValidationRule } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Select } from "~/components/ui/select";

type FormSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  value?: string;
  defaultValue?: string ;
  required?: string | ValidationRule<boolean>;
  readOnly?: boolean;
  disabled?: boolean;
  options?: Record<string, unknown>;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode
};

const FormSelect = <TFieldValues extends FieldValues = FieldValues>(
  props: FormSelectProps<TFieldValues>
) => {
  const {
    name,
    label,
    value,
    defaultValue,
    required = false,
    readOnly = false,
    disabled = false,
    className,
    containerClassName,
    children,
  } = props;

  const formContext = useFormContext<TFieldValues>();

  if (formContext === null) {
    throw Error("You must use a FormProvider so FormInput can get the form context with useFormContext")
  }

  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const options = { required, ...props.options };

  return (
    <div className={containerClassName}>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-600"
      >
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <Select
        {...register(name, options)}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={!!errors?.[name]}
        disabled={disabled}
        
      >
        {children}
      </Select>
      {errors?.[name] && (
        <p className="pt-0.5 text-xs text-red-600">
          {errors?.[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default FormSelect;

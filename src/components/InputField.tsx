import React from "react";
import type { FieldValues, Path, ValidationRule } from "react-hook-form";
import { useFormContext } from "react-hook-form";

type InputFieldProps<V extends FieldValues = FieldValues> = {
  name: Path<V>;
  type?: string;
  label?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  required?: string | ValidationRule<boolean>;
  readonly?: boolean;
  disabled?: boolean;
  options?: Record<string, unknown>;
  className?: string;
  children?: React.ReactNode;
};

const InputField = <V extends FieldValues = FieldValues>(
  props: InputFieldProps<V>
) => {
  const {
    name,
    type = "text",
    label,
    value,
    defaultValue,
    required = false,
    readonly = false,
    disabled = false,
    className = "",
  } = props;

  const formContext = useFormContext<V>();

  if (formContext === null) {
    throw Error("You must use a FormProvider so InputField can get the form context with useFormContext")
  }

  const {
    register,
    formState: { errors },
  } = useFormContext<V>();
  const options = { required, ...props.options };

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-600"
      >
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {type === "select" ? (
        <select
          {...register(name, options)}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={errors?.[name] ? "true" : "false"}
          disabled={disabled}
          className="w-full rounded border border-gray-200 bg-white p-1"
        >
          {props.children}
        </select>
      ) : (
        <input
          {...register(name, options)}
          type={type}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={errors?.[name] ? "true" : "false"}
          readOnly={readonly}
          disabled={disabled}
          className="w-full rounded border border-gray-200 bg-white p-1"
        />
      )}

      {errors?.[name] && (
        <p className="pt-0.5 text-xs text-red-600">
          {errors?.[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;

import React from "react";
import type { UseFormReturn, ValidationRule } from "react-hook-form";

type InputFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  type?: string;
  label?: string;
  value?: string | number | readonly string[] | undefined;
  required?: string | ValidationRule<boolean>;
  disabled?: boolean;
  options?: Record<string, unknown>;
  className?: string;
  children?: React.ReactNode;
};

const InputField = (props: InputFieldProps) => {
  const {
    name,
    type = "text",
    label,
    value,
    required = false,
    disabled = false,
    className = "",
  } = props;
  const {
    register,
    formState: { errors },
  } = props.form;
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
          aria-invalid={errors?.[name] ? "true" : "false"}
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

import React from "react";
import type { UseFormReturn } from "react-hook-form";

type InputFieldProps = {
  form: UseFormReturn<any>;
  name: string;
  required?: boolean;
  type?: string;
  label?: string;
  options?: Record<string, unknown>;
};

const InputField = (props: InputFieldProps) => {
  const { name, required = true, type = "text", label} = props;
  const { register, formState: { errors } } = props.form;
  const options = { required, ...props.options};
  return (
    <div>
      <label htmlFor={name} className="block">{label}</label>
      <input type={type} {...register(name, options)} aria-invalid={errors?.[name] ? "true" : "false"} className="border border-gray-200"/>
      {errors?.[name] && <p>{errors?.[name]?.message?.toString()}</p> }
    </div>
  );
};

export default InputField;

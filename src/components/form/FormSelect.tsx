import React from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
  type ValidationRule,
} from "react-hook-form";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";

type FormSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  value?: PathValue<TFieldValues, Path<TFieldValues>>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  required?: string | ValidationRule<boolean>;
  readOnly?: boolean;
  disabled?: boolean;
  options?: Record<string, unknown>;
  placeholder?: string;
  className?: string;
  innerClass?: string;
  children: React.ReactNode;
};

const FormSelect = <TFieldValues extends FieldValues = FieldValues>(
  props: FormSelectProps<TFieldValues>
) => {
  const {
    name,
    label,
    defaultValue,
    required = false,
    disabled = false,
    placeholder,
    className,
    innerClass,
    children,
  } = props;

  const formContext = useFormContext<TFieldValues>();

  if (formContext === null) {
    throw Error(
      "You must use a FormProvider so FormInput can get the form context with useFormContext"
    );
  }

  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
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
      <Controller
        control={control}
        name={name}
        rules={options}
        defaultValue={defaultValue}
        render={({ field: { onChange, value, ref } }) => {
          return (
            <Select
              value={value}
              aria-invalid={!!errors?.[name]}
              disabled={disabled}
              onValueChange={(val: string) => onChange(val as typeof value)}
            >
              <SelectTrigger className={innerClass}>
                <SelectValue placeholder={placeholder ?? "Select"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]" ref={ref}>
                <ScrollArea>{children}</ScrollArea>
              </SelectContent>
            </Select>
          );
        }}
      />

      {errors?.[name] && (
        <p className="pt-0.5 text-xs text-red-600">
          {errors?.[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default FormSelect;

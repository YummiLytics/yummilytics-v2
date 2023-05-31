import React from "react";
import { type SetupFormPage, inputNames } from "./[[...index]]";
import InputField from "~/components/InputField";
import states from "~/static/state_codes.json";

const OrganizationCreation: SetupFormPage = (props) => {
  const { form, setCurrentPage } = props;

  const nameRegex = /^[a-zA-Z]+((-|\s)([a-zA-Z])+)*?$/gm;
  const phoneRegex = /^(1|\+1)?(?:-|\s)?\(?(\d{3})\)?(?:\s|-)?(\d{3})(?:-|\s)?(\d{4})$/

  const PersonalInfo = () => (
    <div>
      <h2 className="mb-4 text-center text-lg font-bold text-gray-600">
        Tell Us About You
      </h2>
      <div className="mx-auto flex flex-col gap-4">
        <div className="flex w-full gap-8">
          <InputField
            form={form}
            name={inputNames.repFirstName}
            label="First Name"
            required={"Please enter your first name."}
            className="flex-1"
            options={{
              pattern: {
                value: nameRegex,
                message: "Please enter a valid first name.",
              },
            }}
          />
          <InputField
            form={form}
            name={inputNames.repLastName}
            label="Last Name"
            required={"Please enter your last name."}
            className="flex-1"
            options={{
              pattern: {
                value: nameRegex,
                message: "Please enter a valid last name.",
              },
            }}
          />
        </div>
        <div>
          <InputField
            form={form}
            name={inputNames.repPhone}
            label="Phone Number"
            type="tel"
            required={"Please enter your phone number."}
            options={{
              pattern: {
                value: phoneRegex,
                message: "Please enter a valid phone number.",
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  const CompanyInfo = () => (
    <div>
      <h2 className="mb-4 text-center text-lg font-bold text-gray-600">
        Tell Us About Your Company
      </h2>
      <div className="mx-auto flex flex-col gap-4">
        <InputField
          form={form}
          name={inputNames.companyName}
          label="Company Name"
          //         required
        />
        <InputField
          form={form}
          name={inputNames.companyAddress}
          label="Address"
          //       required
        />
        <div className="flex gap-4">
          <InputField
            form={form}
            name={inputNames.companyCity}
            label="City"
            //          required
            className="flex-1"
          />
          <InputField
            form={form}
            name={inputNames.companyState}
            label="State"
            type="select"
            value="CO"
            disabled
            //           required
            className="w-2/12 min-w-fit"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </InputField>
          <InputField
            form={form}
            name={inputNames.companyZip}
            label="ZIP"
            //            required
            className="w-3/12"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="mx-auto flex w-11/12 flex-col gap-8 md:p-8">
        <PersonalInfo key={"personalInfo"}/>
        <CompanyInfo />
      </div>
    </>
  );
};

export default OrganizationCreation;

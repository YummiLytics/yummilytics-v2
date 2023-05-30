import React from "react";
import { type SetupFormPage, inputNames } from "./[[...index]]";
import InputField from "~/components/InputField";

const OrganizationCreation: SetupFormPage = (props) => {
  const { form, setCurrentPage } = props;

  return (
    <>
      <div>
        <h1 className="text-center text-lg font-bold text-gray-600">
          Tell Us About You
        </h1>
      </div>
      <div>
        <div>
          <InputField
            form={form}
            name={inputNames.repFirstName}
            label="First Name"
          />
        </div>
      </div>
    </>
  );
};

export default OrganizationCreation;

import React from 'react';
import { type SetupFormPage } from '~/types';
import CreateLocation from '~/components/CreateLocation';

const CreateFirstLocation: SetupFormPage = ({}) => {
  return <CreateLocation useCompanyDefaults/>
}

export default CreateFirstLocation

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import FormStructure from '../model/FormStructure';
import { buildFormStructure } from '../utils/formBuilder';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  formStructure: FormStructure;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
  getClonedFormStructure: () => FormStructure;
}

// @ts-ignore
const FormStructureContext = React.createContext<FormStructureContextValues>({});

const FormStructureProvider: React.FC<FormStructureProviderProps> = ({ children }) => {
  // @ts-ignore
  const [formStructure, setFormStructure] = useState<FormStructure>(null);

  useEffect(() => {
    async function getFormStructure() {
      const form = require('../utils/form.json');
      const formStructure = await buildFormStructure(form);

      setFormStructure(formStructure);
    }

    getFormStructure();
  }, []);

  const getClonedFormStructure = (): FormStructure => {
    return cloneDeep(formStructure)!;
  };

  const values = React.useMemo<FormStructureContextValues>(
    () => ({
      getClonedFormStructure,
      setFormStructure,
      formStructure
    }),
    [formStructure]
  );

  if (!formStructure) {
    return null;
  }

  return <FormStructureContext.Provider value={values}>{children}</FormStructureContext.Provider>;
};

export { FormStructureContext, FormStructureProvider };

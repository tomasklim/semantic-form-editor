import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import ETree from '../model/ETree';
import { buildFormStructure } from '../utils/formBuilder';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  formStructure: ETree;
  setFormStructure: Dispatch<SetStateAction<ETree>>;
  getClonedFormStructure: () => ETree;
}

// @ts-ignore
const FormStructureContext = React.createContext<FormStructureContextValues>({});

const FormStructureProvider: React.FC<FormStructureProviderProps> = ({ children }) => {
  // @ts-ignore
  const [formStructure, setFormStructure] = useState<ETree>(null);

  useEffect(() => {
    async function getFormStructure() {
      const form = require('../utils/form.json');
      const formStructure = await buildFormStructure(form);

      setFormStructure(formStructure);
    }

    getFormStructure();
  }, []);

  const getClonedFormStructure = (): ETree => {
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

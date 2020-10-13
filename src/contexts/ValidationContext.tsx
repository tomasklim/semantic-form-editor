import React, { useState } from 'react';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { shaclFormValidation } from '@utils/index';
import { useSnackbar } from 'notistack';

interface ValidationContextProps {
  children: React.ReactNode;
}

export type ValidationError = Array<{
  attribute: string;
  error: string;
}>;

interface ValidationContextValues {
  questionErrors: Map<string, ValidationError>;
  validateForm: (form: JsonLdObj) => void;
  isValid: boolean | undefined;
}

// @ts-ignore
const ValidationContext = React.createContext<CustomiseQuestionContextValues>({});

const ValidationProvider: React.FC<ValidationContextProps> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [questionErrors, setQuestionErrors] = useState<Map<string, ValidationError>>(
    new Map<string, ValidationError>()
  );

  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  const validateForm = async (form: JsonLdObj) => {
    const [valid, errors] = await shaclFormValidation(form);

    if (!valid) {
      enqueueSnackbar(`There are errors on ${errors.size} questions!`, {
        variant: 'error'
      });
    } else {
      enqueueSnackbar(`Your form is valid!`, {
        variant: 'success'
      });
    }
    setIsValid(valid);
    setQuestionErrors(errors);
  };

  const values = React.useMemo<ValidationContextValues>(
    // @ts-ignore
    () => ({
      questionErrors,
      isValid,
      validateForm
    }),
    [questionErrors, isValid]
  );

  return <ValidationContext.Provider value={values}>{children}</ValidationContext.Provider>;
};

export { ValidationContext, ValidationProvider };

import React, { Dispatch, SetStateAction } from 'react';

interface EditorProviderProps {}

interface EditorContextValues {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  SFormsConfig: object;
  setSFormsConfig: Dispatch<SetStateAction<object>>;
}

// @ts-ignore
const EditorContext = React.createContext<CustomiseItemContextValues>({});

const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [SFormsConfig, setSFormsConfig] = React.useState<object>({});

  const values = React.useMemo<EditorContextValues>(
    () => ({
      activeStep,
      setActiveStep,
      SFormsConfig,
      setSFormsConfig
    }),
    [activeStep, SFormsConfig]
  );

  return <EditorContext.Provider value={values}>{children}</EditorContext.Provider>;
};

export { EditorContext, EditorProvider };

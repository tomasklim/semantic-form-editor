import React, { Dispatch, SetStateAction } from 'react';

interface EditorProviderProps {
  children: React.ReactNode;
}

interface EditorContextValues {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  SFormsConfig: Partial<SFormsConfig>;
  updateSFormsConfig: (change: Partial<SFormsConfig>) => void;
  languages: Array<string>;
  setLanguages: Dispatch<SetStateAction<Array<string>>>;
}

interface SFormsConfig {
  startingQuestionId: string;
}

// @ts-ignore
const EditorContext = React.createContext<EditorContextValues>({});

const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [SFormsConfig, setSFormsConfig] = React.useState<Partial<SFormsConfig>>({});
  const [languages, setLanguages] = React.useState<Array<string>>([]);

  const updateSFormsConfig = (change: Partial<SFormsConfig>): void => {
    setSFormsConfig({ ...SFormsConfig, ...change });
  };

  const values = React.useMemo<EditorContextValues>(
    () => ({
      activeStep,
      setActiveStep,
      SFormsConfig,
      updateSFormsConfig,
      languages,
      setLanguages
    }),
    [activeStep, SFormsConfig, languages]
  );

  return <EditorContext.Provider value={values}>{children}</EditorContext.Provider>;
};

export { EditorContext, EditorProvider };

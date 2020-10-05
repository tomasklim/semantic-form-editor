import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { IIntl } from '@interfaces/index';
import { getIntl } from '@utils/formHelpers';

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
  intl: IIntl;
  configModalDisplayed: boolean;
  setConfigModalDisplayed: Dispatch<SetStateAction<boolean>>;
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
  const [intl, setIntl] = React.useState<IIntl>({});

  const [configModalDisplayed, setConfigModalDisplayed] = React.useState<boolean>(false);

  useEffect(() => {
    setIntl(getIntl(languages[0]));
  }, [languages]);

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
      setLanguages,
      intl,
      configModalDisplayed,
      setConfigModalDisplayed
    }),
    [activeStep, SFormsConfig, languages, intl, configModalDisplayed]
  );

  return <EditorContext.Provider value={values}>{children}</EditorContext.Provider>;
};

export { EditorContext, EditorProvider };

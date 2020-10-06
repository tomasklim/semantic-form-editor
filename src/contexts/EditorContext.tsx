import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { getIntl } from '@utils/formHelpers';
import { Intl } from 's-forms';

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
  intl: Intl;
  configModalDisplayed: boolean;
  setConfigModalDisplayed: Dispatch<SetStateAction<boolean>>;
  sectionsExpanded: boolean;
  setSectionsExpanded: Dispatch<SetStateAction<boolean>>;
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
  const [intl, setIntl] = React.useState<Intl>({});
  const [sectionsExpanded, setSectionsExpanded] = React.useState<boolean>(true);

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
      setConfigModalDisplayed,
      sectionsExpanded,
      setSectionsExpanded
    }),
    [activeStep, SFormsConfig, languages, intl, configModalDisplayed, sectionsExpanded]
  );

  return <EditorContext.Provider value={values}>{children}</EditorContext.Provider>;
};

export { EditorContext, EditorProvider };

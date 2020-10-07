import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { getIntl } from '@utils/formHelpers';
import { Intl } from 's-forms';

interface EditorProviderProps {
  children: React.ReactNode;
}

interface EditorContextValues {
  SFormsConfig: Partial<SFormsConfig>;
  updateSFormsConfig: (change: Partial<SFormsConfig>) => void;
  languages: Array<string>;
  setLanguages: Dispatch<SetStateAction<Array<string>>>;
  intl: Intl;
  sectionsExpanded: boolean;
  setSectionsExpanded: Dispatch<SetStateAction<boolean>>;
}

interface SFormsConfig {
  startingQuestionId: string;
}

// @ts-ignore
const EditorContext = React.createContext<EditorContextValues>({});

const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [SFormsConfig, setSFormsConfig] = React.useState<Partial<SFormsConfig>>({});
  const [languages, setLanguages] = React.useState<Array<string>>([]);
  const [intl, setIntl] = React.useState<Intl>({});
  const [sectionsExpanded, setSectionsExpanded] = React.useState<boolean>(true);

  useEffect(() => {
    setIntl(getIntl(languages[0]));
  }, [languages]);

  const updateSFormsConfig = (change: Partial<SFormsConfig>): void => {
    setSFormsConfig({ ...SFormsConfig, ...change });
  };

  const values = React.useMemo<EditorContextValues>(
    () => ({
      SFormsConfig,
      updateSFormsConfig,
      languages,
      setLanguages,
      intl,
      sectionsExpanded,
      setSectionsExpanded
    }),
    [SFormsConfig, languages, intl, sectionsExpanded]
  );

  return <EditorContext.Provider value={values}>{children}</EditorContext.Provider>;
};

export { EditorContext, EditorProvider };

import React, { Dispatch, SetStateAction, useState } from 'react';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface CustomiseItemProviderProps {
  children: React.ReactNode;
}

interface CustomiseQuestionContextValues {
  customiseQuestion: CustomiseQuestion;
  onSaveCallback: OnSaveCallback | null;
  customisingQuestion: FormStructureQuestion | null;
  resetCustomisationProcess: () => void;
  setCustomisingQuestion: Dispatch<SetStateAction<FormStructureQuestion | null>>;
  isNewQuestion: boolean;
}

export type OnSaveCallback = (customisingQuestion: FormStructureQuestion) => void;

type CustomiseQuestion = ({
  customisingQuestion,
  onSave,
  onCancel,
  onInit,
  isNewQuestion
}: {
  customisingQuestion: FormStructureQuestion;
  onSave?: (customisingQuestion: FormStructureQuestion) => void;
  onCancel?: () => void;
  onInit?: () => void;
  isNewQuestion?: boolean;
}) => void;

// @ts-ignore
const CustomiseQuestionContext = React.createContext<CustomiseQuestionContextValues>({});

const CustomiseQuestionProvider: React.FC<CustomiseItemProviderProps> = ({ children }) => {
  // @ts-ignore
  const [customisingQuestion, setCustomisingQuestion] = useState<FormStructureQuestion | null>(null);

  // @ts-ignore
  const [onSaveCallback, setOnSaveCallback] = useState<OnSaveCallback | null>(null);

  // @ts-ignore
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(null);

  const [isNewQuestion, setIsNewQuestion] = useState<boolean>(false);

  const customiseQuestion: CustomiseQuestion = ({ customisingQuestion, onSave, onCancel, onInit, isNewQuestion }) => {
    onCancelCallback && onCancelCallback();
    onInit && onInit();
    onSave && setOnSaveCallback(onSave);
    onCancel && setOnCancelCallback(onCancel);
    isNewQuestion && setIsNewQuestion(isNewQuestion);

    setCustomisingQuestion(customisingQuestion);
  };

  const resetCustomisationProcess = () => {
    onCancelCallback && onCancelCallback();

    setOnSaveCallback(null);
    setCustomisingQuestion(null);
    setOnCancelCallback(null);
    setIsNewQuestion(false);
  };

  const values = React.useMemo<CustomiseQuestionContextValues>(
    () => ({
      customiseQuestion,
      setCustomisingQuestion,
      onSaveCallback,
      customisingQuestion,
      resetCustomisationProcess,
      isNewQuestion
    }),
    [customisingQuestion, onSaveCallback, isNewQuestion]
  );

  return <CustomiseQuestionContext.Provider value={values}>{children}</CustomiseQuestionContext.Provider>;
};

export { CustomiseQuestionContext, CustomiseQuestionProvider };

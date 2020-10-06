import React, { Dispatch, SetStateAction, useState } from 'react';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface CustomiseItemProviderProps {
  children: React.ReactNode;
}

interface CustomiseQuestionContextValues {
  customiseQuestion: CustomiseQuestion;
  onSaveCallback: OnSaveQuestionCallback | OnSaveQuestionsCallback | null;
  customisingQuestion: FormStructureQuestion | null;
  resetCustomisationProcess: (forceReset?: boolean) => void;
  setCustomisingQuestion: Dispatch<SetStateAction<FormStructureQuestion | null>>;
  isNewQuestion: boolean;
  isSpecificPosition: boolean;
  level?: number | null;
}

export type OnSaveQuestionCallback = (customisingQuestion: FormStructureQuestion) => void;
export type OnSaveQuestionsCallback = (
  customisingQuestion: FormStructureQuestion | Array<FormStructureQuestion>
) => void;

export type CustomiseQuestion = ({
  customisingQuestion,
  onSave,
  onCancel,
  onInit,
  isNewQuestion,
  isSpecificPosition
}: {
  customisingQuestion: FormStructureQuestion;
  onSave?: OnSaveQuestionCallback | OnSaveQuestionsCallback;
  onCancel?: () => void;
  onInit?: () => void;
  isNewQuestion?: boolean;
  isSpecificPosition?: boolean;
  level?: number;
}) => void;

// @ts-ignore
const CustomiseQuestionContext = React.createContext<CustomiseQuestionContextValues>({});

const CustomiseQuestionProvider: React.FC<CustomiseItemProviderProps> = ({ children }) => {
  // @ts-ignore
  const [customisingQuestion, setCustomisingQuestion] = useState<FormStructureQuestion | null>(null);

  // @ts-ignore
  const [onSaveCallback, setOnSaveCallback] = useState<OnSaveQuestionCallback | OnSaveQuestionsCallback | null>(null);

  // @ts-ignore
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(null);

  const [isNewQuestion, setIsNewQuestion] = useState<boolean>(false);
  const [isSpecificPosition, setIsSpecificPosition] = useState<boolean>(false);
  const [level, setLevel] = useState<number | null>(null);

  const customiseQuestion: CustomiseQuestion = ({
    customisingQuestion,
    onSave,
    onCancel,
    onInit,
    isNewQuestion,
    isSpecificPosition,
    level
  }) => {
    onCancelCallback && onCancelCallback();
    onInit && onInit();
    onSave && setOnSaveCallback(onSave);
    onCancel && setOnCancelCallback(onCancel);
    isNewQuestion && setIsNewQuestion(true);
    isSpecificPosition && setIsSpecificPosition(true);
    // @ts-ignore
    Number.isInteger(level) && setLevel(level);

    setCustomisingQuestion(customisingQuestion);
  };

  const resetCustomisationProcess = (forceReset: boolean = false) => {
    if (onCancelCallback || forceReset) {
      onCancelCallback && onCancelCallback();

      setOnSaveCallback(null);
      setCustomisingQuestion(null);
      setOnCancelCallback(null);
      setIsNewQuestion(false);
      setIsSpecificPosition(false);
      setLevel(null);
    }
  };

  const values = React.useMemo<CustomiseQuestionContextValues>(
    () => ({
      customiseQuestion,
      setCustomisingQuestion,
      onSaveCallback,
      customisingQuestion,
      resetCustomisationProcess,
      isNewQuestion,
      isSpecificPosition,
      level
    }),
    [customisingQuestion, onSaveCallback, isNewQuestion, isSpecificPosition, level]
  );

  return <CustomiseQuestionContext.Provider value={values}>{children}</CustomiseQuestionContext.Provider>;
};

export { CustomiseQuestionContext, CustomiseQuestionProvider };

import React, { Dispatch, SetStateAction, useState } from 'react';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface CustomiseItemProviderProps {
  children: React.ReactNode;
}

interface CustomiseItemContextValues {
  customiseItemData: CustomiseItemData;
  onSaveCallback: OnSaveCallback | null;
  itemData: FormStructureQuestion | null;
  setItemData: Dispatch<SetStateAction<FormStructureQuestion | null>>;
  isNew: boolean;
}

export type OnSaveCallback = (itemData: FormStructureQuestion) => void;
type CustomiseItemData = ({
  itemData,
  onSave,
  onCancel,
  onInit,
  isNew
}: {
  itemData: FormStructureQuestion;
  onSave?: (itemData: FormStructureQuestion) => void;
  onCancel?: () => void;
  onInit?: () => void;
  isNew: boolean;
}) => void;

// @ts-ignore
const CustomiseItemContext = React.createContext<CustomiseContextValues>({});

const CustomiseItemProvider: React.FC<CustomiseItemProviderProps> = ({ children }) => {
  // @ts-ignore
  const [itemData, setItemData] = useState<FormStructureQuestion | null>(null);

  // @ts-ignore
  const [onSaveCallback, setOnSaveCallback] = useState<OnSaveCallback | null>(null);

  // @ts-ignore
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(null);

  const [isNew, setIsNew] = useState<boolean>(false);

  const customiseItemData: CustomiseItemData = ({ itemData, onSave, onCancel, onInit, isNew }) => {
    onCancelCallback && onCancelCallback();
    onInit && onInit();
    setItemData(itemData);
    onSave && setOnSaveCallback(onSave);
    onCancel && setOnCancelCallback(onCancel);
    isNew && setIsNew(isNew);
  };

  const reset = () => {
    setOnSaveCallback(null);
    setItemData(null);
    onCancelCallback && onCancelCallback();
    setOnCancelCallback(null);
    setIsNew(false);
  };

  const values = React.useMemo<CustomiseItemContextValues>(
    () => ({
      customiseItemData,
      setItemData,
      onSaveCallback,
      itemData,
      reset,
      isNew
    }),
    [itemData, onSaveCallback, isNew]
  );

  return <CustomiseItemContext.Provider value={values}>{children}</CustomiseItemContext.Provider>;
};

export { CustomiseItemContext, CustomiseItemProvider };

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
}

export type OnSaveCallback = (itemData: FormStructureQuestion) => void;
type CustomiseItemData = (
  itemData: FormStructureQuestion,
  onSaveCallback: (itemData: FormStructureQuestion) => void
) => void;

// @ts-ignore
const CustomiseItemContext = React.createContext<CustomiseContextValues>({});

const CustomiseItemProvider: React.FC<CustomiseItemProviderProps> = ({ children }) => {
  // @ts-ignore
  const [itemData, setItemData] = useState<FormStructureQuestion | null>(null);

  // @ts-ignore
  const [onSaveCallback, setOnSaveCallback] = useState<OnSaveCallback | null>(null);

  const customiseItemData: CustomiseItemData = (itemData, onSaveCallback) => {
    setItemData(itemData);
    setOnSaveCallback(onSaveCallback);
  };

  const reset = () => {
    setOnSaveCallback(null);
    setItemData(null);
  };

  const values = React.useMemo<CustomiseItemContextValues>(
    () => ({
      customiseItemData,
      setItemData,
      onSaveCallback,
      itemData,
      reset
    }),
    [itemData, onSaveCallback]
  );

  return <CustomiseItemContext.Provider value={values}>{children}</CustomiseItemContext.Provider>;
};

export { CustomiseItemContext, CustomiseItemProvider };

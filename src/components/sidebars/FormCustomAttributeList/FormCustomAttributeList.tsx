import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { FORM_STRUCTURE_QUESTION_ATTRIBUTES, FormStructureQuestion } from '@model/FormStructureQuestion';
import useStyles from './FormCustomAttributeList.styles';
import { FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FormCustomAttributeInput from '@components/sidebars/FormCustomAttributeInput/FormCustomAttributeInput';
import { Clear } from '@material-ui/icons';
import { createFakeChangeEvent, createJsonAttIdValue, getJsonAttValue } from '@utils/formHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';

interface FormCustomAttributeListProps {
  itemData: FormStructureQuestion;
  handleChange: (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => void;
  setItemData: Dispatch<SetStateAction<FormStructureQuestion | null>>;
}

const FormCustomAttributeList: React.FC<FormCustomAttributeListProps> = ({ itemData, handleChange, setItemData }) => {
  const classes = useStyles();

  const [showCustomAttribute, setShowCustomAttribute] = useState<boolean>(false);

  const { formContext } = useContext(FormStructureContext);

  const deleteGenericAttribute = (key: string) => {
    delete itemData[key];
    setItemData({ ...itemData });
  };

  const handleCustomAttributeInputChange = (e: React.ChangeEvent) => {
    try {
      const value = JSON.parse((e.target as HTMLInputElement).value);

      const fakeEvent: any = createFakeChangeEvent((e.target as HTMLInputElement).name, value);

      handleChange(fakeEvent);
    } catch (_) {
      const contextAttribute = Object.values(formContext).find(
        (value) => value['@id'] === (e.target as HTMLInputElement).name
      );

      let value;
      if (contextAttribute && contextAttribute['@type'] === '@id') {
        value = createJsonAttIdValue((e.target as HTMLInputElement).value);
      }

      value = value || (e.target as HTMLInputElement).value;

      const fakeEvent: any = createFakeChangeEvent((e.target as HTMLInputElement).name, value);

      handleChange(fakeEvent);
    }
  };

  const getCustomAttributeList = () => {
    return Object.entries(itemData)
      .filter(([key]) => !FORM_STRUCTURE_QUESTION_ATTRIBUTES.includes(key))
      .map(([key, value]) => {
        const jsonAttValue = getJsonAttValue(itemData, key, '@id');
        // if jsonAttValue is null, but value is not null and is object, then it is JSON
        const textFieldValue =
          !jsonAttValue && typeof value === 'object' && value !== null
            ? JSON.stringify(value, undefined, 2)
            : jsonAttValue;
        return (
          <FormControl key={key} variant="outlined" className={classes.genericTextField}>
            <InputLabel htmlFor="outlined-adornment-password">{key}</InputLabel>
            <OutlinedInput
              key={key}
              name={key}
              label={key}
              value={textFieldValue}
              multiline
              rowsMax={6}
              onChange={handleCustomAttributeInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => deleteGenericAttribute(key)} edge="end">
                    <Clear fontSize={'small'} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        );
      });
  };

  const customAttributeList = getCustomAttributeList();

  return (
    <>
      {customAttributeList}

      {showCustomAttribute && (
        <FormCustomAttributeInput handleChange={handleChange} setShowCustomAttribute={setShowCustomAttribute} />
      )}

      {!showCustomAttribute && (
        <Link
          component="button"
          variant="body1"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setShowCustomAttribute(true);
          }}
          type="button"
          className={classes.addNewAttribute}
        >
          <AddIcon /> &nbsp;Add new custom attribute
        </Link>
      )}
    </>
  );
};

export default FormCustomAttributeList;

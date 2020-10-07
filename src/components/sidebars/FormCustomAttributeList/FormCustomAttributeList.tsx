import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { FORM_STRUCTURE_QUESTION_ATTRIBUTES, FormStructureQuestion } from '@model/FormStructureQuestion';
import useStyles from './FormCustomAttributeList.styles';
import { FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FormCustomAttributeInput from '@components/sidebars/FormCustomAttributeInput/FormCustomAttributeInput';
import { Clear } from '@material-ui/icons';
import { createJsonAttIdValue, getJsonAttValue } from '@utils/formHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { isNull, isObject } from 'lodash';
import { createFakeChangeEvent } from '@utils/itemHelpers';

interface FormCustomAttributeListProps {
  question: FormStructureQuestion;
  handleChange: (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => void;
  setCustomisingQuestion: Dispatch<SetStateAction<FormStructureQuestion | null>>;
}

const FormCustomAttributeList: React.FC<FormCustomAttributeListProps> = ({
  question,
  handleChange,
  setCustomisingQuestion
}) => {
  const classes = useStyles();

  const [showCustomAttribute, setShowCustomAttribute] = useState<boolean>(false);

  const { formContext } = useContext(FormStructureContext);

  const deleteGenericAttribute = (key: string) => {
    delete question[key];
    setCustomisingQuestion({ ...question });
  };

  const handleCustomAttributeInputChange = (e: React.ChangeEvent) => {
    try {
      // if value is JSON, do not make any code modifications
      const value = JSON.parse((e.target as HTMLInputElement).value);

      const fakeEvent: any = createFakeChangeEvent((e.target as HTMLInputElement).name, value);

      handleChange(fakeEvent);
    } catch (_) {
      const contextAttribute = Object.values(formContext).find(
        (contextAttribute) => contextAttribute['@id'] === (e.target as HTMLInputElement).name
      );

      let value: any = (e.target as HTMLInputElement).value;
      // if attribute is available in context and is not just a string value
      if (contextAttribute && contextAttribute['@type'] === '@id') {
        value = createJsonAttIdValue(value);
      }

      const fakeEvent: any = createFakeChangeEvent((e.target as HTMLInputElement).name, value);

      handleChange(fakeEvent);
    }
  };

  const getCustomAttributeList = () => {
    return Object.entries(question)
      .filter(([key]) => !FORM_STRUCTURE_QUESTION_ATTRIBUTES.includes(key))
      .map(([key, value]) => {
        const jsonAttValue = getJsonAttValue(question, key, '@id');
        // if jsonAttValue is null, but value is not null and is object, then it is JSON
        const textFieldValue =
          !jsonAttValue && isObject(value) && !isNull(value) ? JSON.stringify(value, undefined, 2) : jsonAttValue;
        return (
          <FormControl key={key} variant="outlined" className={classes.genericTextField}>
            <InputLabel htmlFor="outlined-adornment-password">{key}</InputLabel>
            <OutlinedInput
              key={key}
              name={key}
              label={key}
              value={textFieldValue}
              multiline
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

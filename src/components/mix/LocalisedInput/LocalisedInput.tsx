import { FormStructureQuestion, LanguageObject } from '@model/FormStructureQuestion';
import React from 'react';
import { TextField } from '@material-ui/core';
import { isString } from 'lodash';
import { Constants } from 's-forms';
import { createFakeChangeEvent } from '@utils/itemHelpers';

interface LocalisedInputProps {
  type: string;
  question: FormStructureQuestion;
  handleChange: any;
  multiline?: boolean;
  autoFocus?: boolean;
}

const LocalisedInput: React.FC<LocalisedInputProps> = ({ type, question, handleChange, multiline, autoFocus }) => {
  const value = question[type];

  const handleLabelsChange = (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLInputElement;

    const lang = target.getAttribute('data-language');

    if (!lang) {
      handleChange(e);
    }

    value.forEach((labelObj: LanguageObject) => {
      if (labelObj['@language'] === lang) {
        labelObj['@value'] = target.value;
      }
    });

    const fakeEvent = createFakeChangeEvent(type, value);

    handleChange(fakeEvent);
  };

  if (!value || isString(value)) {
    return (
      <TextField
        name={type}
        label="Label"
        variant="outlined"
        value={value || ''}
        onChange={handleChange}
        autoComplete={'off'}
        autoFocus={autoFocus}
        required
        // @ts-ignore
        multiline={multiline}
      />
    );
  }

  return value.map((labelLang: LanguageObject, index: number) => {
    return (
      <TextField
        key={labelLang['@language']}
        name={type}
        inputProps={{ ['data-language']: labelLang['@language'] }}
        label={'Label ' + labelLang['@language'].toUpperCase()}
        variant="outlined"
        value={labelLang['@value'] || ''}
        onChange={handleLabelsChange}
        autoComplete={'off'}
        autoFocus={autoFocus && index === 0}
        required
        // @ts-ignore
        multiline={multiline}
      />
    );
  });
};

export default LocalisedInput;

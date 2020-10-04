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
  required?: boolean;
}

const LocalisedInput: React.FC<LocalisedInputProps> = ({
  type,
  question,
  handleChange,
  multiline,
  autoFocus,
  required
}) => {
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

  let label: string;
  switch (type) {
    case (Constants.RDFS_LABEL as unknown) as string:
      label = 'Label';
      break;
    case (Constants.HELP_DESCRIPTION as unknown) as string:
      label = 'Help description';
      break;
    default:
      label = 'Unknown type';
  }

  if (!value || isString(value)) {
    return (
      <TextField
        name={type}
        label={label}
        variant="outlined"
        value={value || ''}
        onChange={handleChange}
        autoComplete={'off'}
        autoFocus={autoFocus}
        required={required}
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
        label={`${label} ${labelLang['@language'].toUpperCase()}`}
        variant="outlined"
        value={labelLang['@value'] || ''}
        onChange={handleLabelsChange}
        autoComplete={'off'}
        autoFocus={autoFocus && index === 0}
        required={required}
        // @ts-ignore
        multiline={multiline}
      />
    );
  });
};

export default LocalisedInput;

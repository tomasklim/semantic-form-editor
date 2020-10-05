import { FormStructureQuestion, LanguageObject } from '@model/FormStructureQuestion';
import React, { useContext } from 'react';
import { TextField } from '@material-ui/core';
import { Constants } from 's-forms';
import { createFakeChangeEvent } from '@utils/itemHelpers';
import { EditorContext } from '@contexts/EditorContext';

interface LocalisedInputProps {
  type: string;
  question: FormStructureQuestion;
  handleChange: (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => void;
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
  let value = question[type] || [];

  const { languages } = useContext(EditorContext);

  const handleLabelsChange = (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLInputElement;

    const lang = target.getAttribute('data-language');

    if (!lang) {
      handleChange(e);
    }

    const availableLanguage =
      Array.isArray(value) && value.find((language: LanguageObject) => language['@language'] === lang);

    if (availableLanguage) {
      availableLanguage['@value'] = target.value;
    } else {
      if (!Array.isArray(value)) {
        value = [];
      }
      value.push({
        '@language': lang,
        '@value': target.value
      });
    }

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

  if (!languages.length) {
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

  return (
    <>
      {languages.map((language: string, index: number) => {
        let foundLanguage;
        Array.isArray(value) &&
          value.forEach((labelObj: LanguageObject) => {
            if (labelObj['@language'] === language) {
              foundLanguage = labelObj;
            }
          });

        return (
          <TextField
            key={language}
            name={type}
            inputProps={{ ['data-language']: language }}
            label={`${label} ${language.toUpperCase()}`}
            variant="outlined"
            value={(foundLanguage && foundLanguage['@value']) || ''}
            onChange={handleLabelsChange}
            autoComplete={'off'}
            autoFocus={autoFocus && index === 0}
            required={required}
            // @ts-ignore
            multiline={multiline}
          />
        );
      })}
    </>
  );
};

export default LocalisedInput;

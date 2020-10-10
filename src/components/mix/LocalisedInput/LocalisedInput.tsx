import { FormStructureQuestion, LanguageObject } from '@model/FormStructureQuestion';
import React, { useContext } from 'react';
import { TextField } from '@material-ui/core';
import { Constants } from 's-forms';
import { createFakeChangeEvent } from '@utils/itemHelpers';
import { EditorContext } from '@contexts/EditorContext';
import { editLocalisedLabel } from '@utils/formHelpers';

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
  let questionValue = question[type] || [];

  const { languages } = useContext(EditorContext);

  const handleLabelsChange = (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLInputElement;

    const lang = target.getAttribute('data-language');

    // simple no language field
    if (!lang) {
      handleChange(e);
      return;
    }

    editLocalisedLabel(lang, target.value, questionValue);

    const fakeEvent = createFakeChangeEvent(type, questionValue);

    handleChange(fakeEvent);
  };

  let label: string;
  switch (type) {
    case Constants.RDFS_LABEL:
      label = 'Label';
      break;
    case Constants.HELP_DESCRIPTION:
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
        value={questionValue || ''}
        onChange={handleChange}
        autoComplete={'off'}
        autoFocus={autoFocus}
        required={required}
        multiline={multiline}
      />
    );
  }

  return (
    <>
      {languages.map((language: string, index: number) => {
        const foundLanguageObject =
          Array.isArray(questionValue) &&
          questionValue.find((languageQuestionObject: LanguageObject) => {
            if (languageQuestionObject['@language'] === language) {
              return languageQuestionObject;
            }
          });

        return (
          <TextField
            key={language}
            name={type}
            inputProps={{ ['data-language']: language }}
            label={`${label} ${language.toUpperCase()}`}
            variant="outlined"
            value={(foundLanguageObject && foundLanguageObject['@value']) || ''}
            onChange={handleLabelsChange}
            autoComplete={'off'}
            autoFocus={autoFocus && index === 0}
            required={required}
            multiline={multiline}
          />
        );
      })}
    </>
  );
};

export default LocalisedInput;

import { Chip, TextField } from '@material-ui/core';
import React, { useContext, useMemo } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Constants, FormUtils } from 's-forms';
import { intersection } from 'lodash';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';

const PRIMARY = 'Primary (choose 0-1)';
const SECONDARY = 'Secondary (choose 0-N)';

const primaryOptions = [
  Constants.LAYOUT.WIZARD_STEP,
  Constants.LAYOUT.QUESTION_SECTION,
  Constants.LAYOUT.DATE,
  Constants.LAYOUT.TIME,
  Constants.LAYOUT.DATETIME,
  Constants.LAYOUT.TEXTAREA,
  Constants.LAYOUT.CHECKBOX,
  Constants.LAYOUT.QUESTION_TYPEAHEAD,
  Constants.LAYOUT.MASKED_INPUT
];

const layoutTypeOptions: Array<LayoutTypeOption> = [
  { value: Constants.LAYOUT.WIZARD_STEP, title: 'Wizard step', type: PRIMARY },
  { value: Constants.LAYOUT.QUESTION_SECTION, title: 'Section', type: PRIMARY },
  { value: Constants.LAYOUT.DATE, title: 'Date', type: PRIMARY },
  { value: Constants.LAYOUT.TIME, title: 'Time', type: PRIMARY },
  { value: Constants.LAYOUT.DATETIME, title: 'Datetime', type: PRIMARY },
  { value: Constants.LAYOUT.TEXTAREA, title: 'Textarea', type: PRIMARY },
  { value: Constants.LAYOUT.CHECKBOX, title: 'Checkbox', type: PRIMARY },
  { value: Constants.LAYOUT.QUESTION_TYPEAHEAD, title: 'Typeahead', type: PRIMARY },
  { value: Constants.LAYOUT.MASKED_INPUT, title: 'Masked Input', type: PRIMARY },
  { value: Constants.LAYOUT.ANSWERABLE, title: 'Answerable', type: SECONDARY },
  { value: Constants.LAYOUT.COLLAPSED, title: 'Collapsed', type: SECONDARY },
  { value: Constants.LAYOUT.DISABLED, title: 'Disabled', type: SECONDARY },
  { value: Constants.LAYOUT.EMPHASISED, title: 'Emphasised', type: SECONDARY },
  { value: Constants.LAYOUT.HIDDEN, title: 'Hidden', type: SECONDARY }
];

type LayoutTypeOption = {
  value: string;
  title: string;
  type: string;
};

interface LayoutClassInputProps {
  question: FormStructureQuestion;
  handleChange: any;
}

const LayoutClassInput: React.FC<LayoutClassInputProps> = ({ question, handleChange }) => {
  const { isWizardless } = useContext(FormStructureContext);
  const { level, isNewQuestion } = useContext(CustomiseQuestionContext);

  const layoutClasses = question[Constants.LAYOUT_CLASS] ? [...question[Constants.LAYOUT_CLASS]] : [];

  const translateLayoutClassesToInputValues = () => {
    if (isNewQuestion && !layoutClasses.length) {
      return [];
    }

    return layoutTypeOptions.filter((layoutTypeOption) => layoutClasses.includes(layoutTypeOption.value));
  };

  const inputValues = translateLayoutClassesToInputValues();

  const onChange = (_: React.ChangeEvent<{}>, picks: Array<LayoutTypeOption>) => {
    picks.sort((pick) => (pick.type === PRIMARY ? -1 : 0));
    handleChange(Object.values(picks).map((pick) => pick.value));
  };

  const disabledOptions = (option: LayoutTypeOption) => {
    return !!(
      primaryOptions.includes(option.value) &&
      intersection(
        Object.values(inputValues).map((inputValue) => inputValue.value),
        primaryOptions
      ).length
    );
  };

  const getLayoutClassOptions = (): Array<LayoutTypeOption> => {
    const copiedLayoutTypeOptions = [...layoutTypeOptions];

    if (level === 0 && !isWizardless) {
      return copiedLayoutTypeOptions.filter(
        (layoutTypeOption) =>
          layoutTypeOption.type === SECONDARY ||
          layoutTypeOption.value === Constants.LAYOUT.WIZARD_STEP ||
          layoutTypeOption.value === Constants.LAYOUT.QUESTION_SECTION
      );
    }

    return copiedLayoutTypeOptions.filter(
      (layoutTypeOption) => layoutTypeOption.value !== Constants.LAYOUT.WIZARD_STEP
    );
  };

  const layoutClassOptions = getLayoutClassOptions();

  return useMemo(
    () => (
      <Autocomplete
        multiple
        options={layoutClassOptions}
        value={inputValues}
        getOptionDisabled={disabledOptions}
        onChange={onChange}
        getOptionLabel={(option) => option.title}
        groupBy={(option) => option.type}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Layout class" placeholder="Choose layout classes" />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.title}
              {...getTagProps({ index })}
              disabled={option.type === PRIMARY && FormUtils.isWizardStep(question)}
            />
          ))
        }
        getOptionSelected={(option, value) => option.value === value.value}
        disableClearable={true}
      />
    ),
    [question[Constants.LAYOUT_CLASS]]
  );
};

export default LayoutClassInput;

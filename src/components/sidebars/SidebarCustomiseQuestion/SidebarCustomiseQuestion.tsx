import React, { FormEvent, useContext } from 'react';
import { Checkbox, FormControl, FormControlLabel, InputLabel, Select, TextField } from '@material-ui/core';
import { Constants, FormUtils } from 's-forms';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarCustomiseQuestion.styles';
import { getId } from '@utils/itemHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { createJsonAttValue, getJsonAttValue } from '@utils/formHelpers';
import FormCustomAttributeList from '@components/sidebars/FormCustomAttributeList/FormCustomAttributeList';
import { isUndefined, isBoolean } from 'lodash';
import classNames from 'classnames';
import FormTypeSwitch from '@components/mix/FormTypeSwitch/FormTypeSwitch';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';

const TEXT_FIELD = 'text';

const layoutTypeOptions = [
  { value: Constants.LAYOUT.WIZARD_STEP, title: 'Wizard step' },
  { value: Constants.LAYOUT.QUESTION_SECTION, title: 'Section' },
  { value: TEXT_FIELD, title: 'Text Input' },
  { value: Constants.LAYOUT.QUESTION_TYPEAHEAD, title: 'Typeahead' },
  { value: Constants.LAYOUT.TEXTAREA, title: 'Textarea' },
  { value: Constants.LAYOUT.DATE, title: 'Date' },
  { value: Constants.LAYOUT.TIME, title: 'Time' },
  { value: Constants.LAYOUT.DATETIME, title: 'Datetime' },
  { value: Constants.LAYOUT.MASKED_INPUT, title: 'Masked Input' },
  { value: Constants.LAYOUT.CHECKBOX, title: 'Checkbox' }
];

// no section, no wizard-step
const layoutTypeFields = [
  TEXT_FIELD,
  Constants.LAYOUT.QUESTION_TYPEAHEAD,
  Constants.LAYOUT.TEXTAREA,
  Constants.LAYOUT.DATE,
  Constants.LAYOUT.TIME,
  Constants.LAYOUT.DATETIME,
  Constants.LAYOUT.MASKED_INPUT,
  Constants.LAYOUT.CHECKBOX
];

interface SidebarCustomiseQuestionProps {
  isWizardlessFormType: boolean;
  handleFormTypeChange: () => void;
}

const SidebarCustomiseQuestion: React.FC<SidebarCustomiseQuestionProps> = ({
  isWizardlessFormType,
  handleFormTypeChange
}) => {
  const classes = useStyles();

  const { formStructure, isWizardless } = useContext(FormStructureContext);

  const {
    onSaveCallback,
    customisingQuestion,
    resetCustomisationProcess,
    setCustomisingQuestion,
    isNewQuestion
  } = useContext(CustomiseQuestionContext);

  const handleChange = (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === ((Constants.RDFS_LABEL as unknown) as string)) {
      let id = customisingQuestion!['@id'];
      if (isNewQuestion) {
        do {
          id = getId(value);
        } while (formStructure.getNode(id));
      }

      setCustomisingQuestion({
        ...customisingQuestion!,
        [Constants.RDFS_LABEL]: value,
        '@id': id
      });
    } else if (name === ((Constants.LAYOUT_CLASS as unknown) as string)) {
      setCustomisingQuestion({ ...customisingQuestion!, [Constants.LAYOUT_CLASS]: [value] });
    } else if (name === Constants.LAYOUT.COLLAPSED || name === Constants.LAYOUT.DISABLED) {
      const layoutClass = customisingQuestion![Constants.LAYOUT_CLASS]!;

      if (layoutClass.includes(name)) {
        layoutClass.splice(layoutClass.indexOf(name), 1);
      } else {
        layoutClass.push(name);
      }

      setCustomisingQuestion({ ...customisingQuestion!, [Constants.LAYOUT_CLASS]: layoutClass });
    } else if (name === ((Constants.REQUIRES_ANSWER as unknown) as string)) {
      if (!value) {
        setCustomisingQuestion({ ...customisingQuestion!, [name]: null });
      } else {
        const requiresAttribute = createJsonAttValue(value, Constants.XSD.BOOLEAN);

        setCustomisingQuestion({ ...customisingQuestion!, [name]: requiresAttribute });
      }
    } else {
      setCustomisingQuestion({ ...customisingQuestion!, [name]: value });
    }
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { ...customisingQuestion! };

    onSaveCallback && onSaveCallback(newItem);
    resetCustomisationProcess(true);
  };

  const onCancel = () => {
    resetCustomisationProcess();
  };

  const findLayoutTypeOfQuestion = () => {
    let layoutClasses = customisingQuestion && customisingQuestion[Constants.LAYOUT_CLASS];

    if (isUndefined(isWizardless) && !isWizardlessFormType) {
      customisingQuestion![Constants.LAYOUT_CLASS] = [Constants.LAYOUT.WIZARD_STEP, Constants.LAYOUT.QUESTION_SECTION];
      return Constants.LAYOUT.WIZARD_STEP;
    } else if (isUndefined(isWizardless) && isWizardlessFormType && FormUtils.isWizardStep(customisingQuestion)) {
      customisingQuestion![Constants.LAYOUT_CLASS] = [];
      return '';
    }

    if (isNewQuestion && layoutClasses && !layoutClasses.length) {
      return '';
    }

    if (!layoutClasses || !layoutClasses.length) {
      return TEXT_FIELD;
    }

    if (FormUtils.isWizardStep(customisingQuestion)) {
      return Constants.LAYOUT.WIZARD_STEP;
    }

    if (layoutClasses.length === 1 && layoutClasses[0] === Constants.LAYOUT.QUESTION_SECTION) {
      return Constants.LAYOUT.QUESTION_SECTION;
    }

    const layoutType = layoutClasses.filter((layoutClass) => layoutTypeFields.includes(layoutClass));

    if (!layoutType.length && FormUtils.isSection(customisingQuestion)) {
      return Constants.LAYOUT.QUESTION_SECTION;
    }

    if (!layoutType.length) {
      console.warn(`Question with id: ${customisingQuestion?.['@id']} does not have any defined layout type!`);
      return TEXT_FIELD;
    }

    return layoutType[0];
  };

  const layoutType = findLayoutTypeOfQuestion();

  if (!customisingQuestion) {
    return null;
  }

  return (
    <form
      className={classNames(classes.questionFormContainer, { [classes.borderRadiusTop]: !isNewQuestion })}
      onSubmit={onSave}
    >
      {isUndefined(isWizardless) && (
        <FormTypeSwitch isWizardlessFormType={isWizardlessFormType} handleFormTypeChange={handleFormTypeChange} />
      )}

      <TextField
        name="@id"
        label="Identification"
        variant="outlined"
        value={customisingQuestion['@id'] || ' '}
        disabled
      />

      <TextField
        name={(Constants.RDFS_LABEL as unknown) as string}
        label="Label"
        variant="outlined"
        value={JsonLdUtils.getLocalized(customisingQuestion[Constants.RDFS_LABEL], {}) || ''}
        onChange={handleChange}
        autoComplete={'off'}
        autoFocus
        required
      />

      <FormControl variant="outlined">
        <InputLabel htmlFor="layout-type">Layout type</InputLabel>
        <Select
          native
          label="Layout type"
          value={layoutType || ''}
          onChange={handleChange}
          inputProps={{
            name: Constants.LAYOUT_CLASS,
            id: 'layout-type'
          }}
          disabled={
            (isBoolean(isWizardless) && FormUtils.isWizardStep(customisingQuestion)) ||
            (isUndefined(isWizardless) && !isWizardlessFormType)
          }
        >
          <option aria-label="None" value="" />
          {layoutTypeOptions.map((layoutTypeOption) => {
            if (isWizardless && layoutTypeOption.value === Constants.LAYOUT.WIZARD_STEP) {
              return null;
            }

            if (
              isUndefined(isWizardless) &&
              isWizardlessFormType &&
              layoutTypeOption.value === Constants.LAYOUT.WIZARD_STEP
            ) {
              return null;
            } else if (
              isUndefined(isWizardless) &&
              !isWizardlessFormType &&
              layoutTypeOption.value !== Constants.LAYOUT.WIZARD_STEP
            ) {
              return null;
            }

            return (
              <option key={layoutTypeOption.value} value={layoutTypeOption.value}>
                {layoutTypeOption.title}
              </option>
            );
          })}
        </Select>
      </FormControl>

      {FormUtils.isMaskedInput(customisingQuestion) && (
        <TextField
          name={(Constants.INPUT_MASK as unknown) as string}
          label="Input mask"
          variant="outlined"
          value={customisingQuestion[Constants.INPUT_MASK] || ''}
          onChange={handleChange}
          autoComplete={'off'}
          required
        />
      )}

      {FormUtils.isTypeahead(customisingQuestion) && (
        <TextField
          name={(Constants.HAS_OPTIONS_QUERY as unknown) as string}
          label="Options query"
          variant="outlined"
          value={customisingQuestion[Constants.HAS_OPTIONS_QUERY] || ''}
          onChange={handleChange}
          autoComplete={'off'}
          required
        />
      )}

      <TextField
        name={(Constants.HELP_DESCRIPTION as unknown) as string}
        label="Help description"
        variant="outlined"
        value={customisingQuestion[Constants.HELP_DESCRIPTION] || ''}
        onChange={handleChange}
        autoComplete={'off'}
        multiline
      />

      <FormControlLabel
        control={
          <Checkbox
            name={(Constants.REQUIRES_ANSWER as unknown) as string}
            onChange={handleChange}
            checked={getJsonAttValue(customisingQuestion, Constants.REQUIRES_ANSWER) || false}
          />
        }
        label="Required"
      />

      {!FormUtils.isWizardStep(customisingQuestion) && FormUtils.isSection(customisingQuestion) && (
        <FormControlLabel
          control={
            <Checkbox
              name={Constants.LAYOUT.COLLAPSED}
              onChange={handleChange}
              checked={customisingQuestion[Constants.LAYOUT_CLASS]?.includes(Constants.LAYOUT.COLLAPSED)}
            />
          }
          label="Collapsed"
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            name={Constants.LAYOUT.DISABLED}
            onChange={handleChange}
            checked={customisingQuestion[Constants.LAYOUT_CLASS]?.includes(Constants.LAYOUT.DISABLED)}
          />
        }
        label="Disabled"
      />

      <FormCustomAttributeList
        question={customisingQuestion}
        setCustomisingQuestion={setCustomisingQuestion}
        handleChange={handleChange}
      />

      <div className={classes.sidebarButtons}>
        <CustomisedButton type="submit" size={'large'} className={classes.saveButton}>
          Save
        </CustomisedButton>
        {isBoolean(isWizardless) && (
          <CustomisedLinkButton onClick={onCancel} size={'large'}>
            Cancel
          </CustomisedLinkButton>
        )}
      </div>
    </form>
  );
};

export default SidebarCustomiseQuestion;

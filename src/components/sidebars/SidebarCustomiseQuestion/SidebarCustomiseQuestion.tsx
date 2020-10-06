import React, { FormEvent, useContext } from 'react';
import { Checkbox, FormControl, FormControlLabel, InputLabel, Select, TextField } from '@material-ui/core';
import { Constants, FormUtils } from 's-forms';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarCustomiseQuestion.styles';
import { findLayoutTypeOfQuestion, getId } from '@utils/itemHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { createJsonAttValue, getJsonAttValue } from '@utils/formHelpers';
import FormCustomAttributeList from '@components/sidebars/FormCustomAttributeList/FormCustomAttributeList';
import LocalisedInput from '@components/mix/LocalisedInput/LocalisedInput';
import { EditorContext } from '@contexts/EditorContext';
import { isString } from 'lodash';
import { TEXT_FIELD } from '@constants/index';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';

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

const SidebarCustomiseQuestion: React.FC = () => {
  const classes = useStyles();

  const { formStructure, isWizardless, isEmptyFormStructure } = useContext(FormStructureContext);
  const { intl } = useContext(EditorContext);

  const {
    onSaveCallback,
    customisingQuestion,
    resetCustomisationProcess,
    setCustomisingQuestion,
    isNewQuestion,
    level
  } = useContext(CustomiseQuestionContext);

  const handleChangeDefault = (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === ((Constants.LAYOUT_CLASS as unknown) as string)) {
      setCustomisingQuestion({ ...customisingQuestion!, [Constants.LAYOUT_CLASS]: [value] });
    } else if (name === Constants.LAYOUT.COLLAPSED || name === Constants.LAYOUT.DISABLED) {
      const layoutClass = customisingQuestion![Constants.LAYOUT_CLASS]!;

      if (layoutClass.includes(name)) {
        layoutClass.splice(layoutClass.indexOf(name), 1);
      } else {
        layoutClass.push(name);
      }

      setCustomisingQuestion({ ...customisingQuestion!, [Constants.LAYOUT_CLASS]: layoutClass });
    } else {
      setCustomisingQuestion({ ...customisingQuestion!, [name]: value });
    }
  };

  const handleChangeRequiresAnswer = (e: React.ChangeEvent) => {
    const checked = (e.target as HTMLInputElement).checked;

    const attribute = checked ? createJsonAttValue(true, Constants.XSD.BOOLEAN) : null;

    setCustomisingQuestion({ ...customisingQuestion!, [(Constants.REQUIRES_ANSWER as unknown) as string]: attribute });
  };

  const handleChangeLabel = (e: React.ChangeEvent<any>) => {
    const value = (e.target as HTMLInputElement).value;

    let id = customisingQuestion!['@id'];
    if (isNewQuestion) {
      do {
        const label = (isString(value) && value) || JsonLdUtils.getLocalized(value, intl);
        id = getId(label);
      } while (formStructure.getNode(id));
    }

    setCustomisingQuestion({
      ...customisingQuestion!,
      [Constants.RDFS_LABEL]: value,
      '@id': id
    });
  };

  /*
  const handleChangeLayoutClass = (e: React.ChangeEvent<any>) => {

  }*/

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { ...customisingQuestion! };

    onSaveCallback && onSaveCallback(newItem);
    resetCustomisationProcess(true);
  };

  const onCancel = () => {
    resetCustomisationProcess();
  };

  if (!customisingQuestion) {
    return null;
  }

  const layoutType = findLayoutTypeOfQuestion(customisingQuestion, isEmptyFormStructure, isWizardless, isNewQuestion);

  return (
    <form className={classes.form} onSubmit={onSave}>
      <TextField
        name="@id"
        label="Identification"
        variant="outlined"
        value={customisingQuestion['@id'] || ' '}
        disabled
      />

      <LocalisedInput
        type={(Constants.RDFS_LABEL as unknown) as string}
        question={customisingQuestion}
        handleChange={handleChangeLabel}
        autoFocus
        required
      />

      <FormControl variant="outlined">
        <InputLabel htmlFor="layout-type">Layout type</InputLabel>
        <Select
          native
          label="Layout type"
          value={layoutType || ''}
          onChange={handleChangeDefault}
          inputProps={{
            name: Constants.LAYOUT_CLASS,
            id: 'layout-type'
          }}
          disabled={
            (!isEmptyFormStructure && FormUtils.isWizardStep(customisingQuestion)) ||
            (isEmptyFormStructure && !isWizardless)
          }
        >
          <option aria-label="None" value="" />
          {layoutTypeOptions.map((layoutTypeOption) => {
            if (
              !isEmptyFormStructure &&
              level !== 0 &&
              !isWizardless &&
              layoutTypeOption.value === Constants.LAYOUT.WIZARD_STEP
            ) {
              return null;
            } else if (
              isEmptyFormStructure &&
              isWizardless &&
              layoutTypeOption.value === Constants.LAYOUT.WIZARD_STEP
            ) {
              return null;
            } else if (
              isEmptyFormStructure &&
              !isWizardless &&
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
          onChange={handleChangeDefault}
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
          onChange={handleChangeDefault}
          autoComplete={'off'}
          required
        />
      )}

      <LocalisedInput
        type={(Constants.HELP_DESCRIPTION as unknown) as string}
        question={customisingQuestion}
        handleChange={handleChangeDefault}
        multiline
      />

      <FormControlLabel
        control={
          <Checkbox
            name={(Constants.REQUIRES_ANSWER as unknown) as string}
            onChange={handleChangeRequiresAnswer}
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
              onChange={handleChangeDefault}
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
            onChange={handleChangeDefault}
            checked={customisingQuestion[Constants.LAYOUT_CLASS]?.includes(Constants.LAYOUT.DISABLED)}
          />
        }
        label="Disabled"
      />

      <FormCustomAttributeList
        question={customisingQuestion}
        setCustomisingQuestion={setCustomisingQuestion}
        handleChange={handleChangeDefault}
      />

      <div className={classes.sidebarButtons}>
        <CustomisedButton type="submit" size={'large'} className={classes.saveButton}>
          Save
        </CustomisedButton>
        {!isEmptyFormStructure && (
          <CustomisedLinkButton onClick={onCancel} size={'large'}>
            Cancel
          </CustomisedLinkButton>
        )}
      </div>
    </form>
  );
};

export default SidebarCustomiseQuestion;

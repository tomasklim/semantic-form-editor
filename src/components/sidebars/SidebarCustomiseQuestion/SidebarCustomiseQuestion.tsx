import React, { FormEvent, useContext } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { Constants, FormUtils } from 's-forms';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarCustomiseQuestion.styles';
import { getUniqueId } from '@utils/itemHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { createJsonAttValue } from '@utils/formHelpers';
import FormCustomAttributeList from '@components/sidebars/FormCustomAttributeList/FormCustomAttributeList';
import LocalisedInput from '@components/mix/LocalisedInput/LocalisedInput';
import { EditorContext } from '@contexts/EditorContext';
import { isString } from 'lodash';
import LayoutClassInput from '@components/mix/LayoutClassInput/LayoutClassInput';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';
import TypeaheadOptionsModal from '@components/mix/TypeaheadOptionsModal/TypeaheadOptionsModal';

const SidebarCustomiseQuestion: React.FC = () => {
  const classes = useStyles();

  const { formStructure, isEmptyFormStructure } = useContext(FormStructureContext);
  const { intl } = useContext(EditorContext);

  const {
    onSaveCallback,
    customisingQuestion,
    resetCustomiseQuestionContext,
    setCustomisingQuestion,
    isNewQuestion
  } = useContext(CustomiseQuestionContext);

  const handleChangeDefault = (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setCustomisingQuestion({ ...customisingQuestion!, [name]: value });
  };

  const handleChangeRequiresAnswer = (e: React.ChangeEvent) => {
    const checked = (e.target as HTMLInputElement).checked;

    const attribute = checked ? createJsonAttValue(true, Constants.XSD.BOOLEAN) : null;

    setCustomisingQuestion({ ...customisingQuestion!, [Constants.REQUIRES_ANSWER]: attribute });
  };

  const handleChangeLabel = (e: React.ChangeEvent<any>) => {
    const value = (e.target as HTMLInputElement).value;

    let id = customisingQuestion!['@id'];
    if (isNewQuestion) {
      const label = (isString(value) && value) || JsonLdUtils.getLocalized(value, intl);

      id = getUniqueId(label, formStructure);
    }

    setCustomisingQuestion({
      ...customisingQuestion!,
      [Constants.RDFS_LABEL]: value,
      '@id': id
    });
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { ...customisingQuestion! };

    onSaveCallback && onSaveCallback(newItem);
    resetCustomiseQuestionContext();
  };

  const onCancel = () => {
    resetCustomiseQuestionContext();
  };

  if (!customisingQuestion) {
    return null;
  }

  return (
    <form className={classes.form} onSubmit={onSave} id="customise-question-form">
      <TextField
        name="@id"
        label="Identification"
        variant="outlined"
        value={customisingQuestion['@id'] || ' '}
        disabled
        inputProps={{ id: 'identification-input' }}
      />

      <LocalisedInput
        type={Constants.RDFS_LABEL}
        question={customisingQuestion}
        handleChange={handleChangeLabel}
        autoFocus
        required
      />

      <LayoutClassInput question={customisingQuestion} handleChange={handleChangeDefault} />

      {FormUtils.isMaskedInput(customisingQuestion) && (
        <TextField
          name={Constants.INPUT_MASK}
          label="Input mask"
          variant="outlined"
          value={customisingQuestion[Constants.INPUT_MASK] || ''}
          onChange={handleChangeDefault}
          autoComplete={'off'}
          required
        />
      )}

      {FormUtils.isTypeahead(customisingQuestion) && (
        <>
          <TextField
            name={Constants.HAS_OPTIONS_QUERY}
            label="Remote answer options URL"
            variant="outlined"
            value={customisingQuestion[Constants.HAS_OPTIONS_QUERY] || ''}
            onChange={handleChangeDefault}
            autoComplete={'off'}
          />
          <TypeaheadOptionsModal question={customisingQuestion} handleChange={handleChangeDefault} />
        </>
      )}

      <LocalisedInput
        type={Constants.HELP_DESCRIPTION}
        question={customisingQuestion}
        handleChange={handleChangeDefault}
        multiline
      />

      <FormControlLabel
        control={
          <Checkbox
            name={Constants.REQUIRES_ANSWER}
            onChange={handleChangeRequiresAnswer}
            checked={JsonLdUtils.getJsonAttValue(customisingQuestion, Constants.REQUIRES_ANSWER) || false}
          />
        }
        label="Required"
      />

      <FormCustomAttributeList
        question={customisingQuestion}
        setCustomisingQuestion={setCustomisingQuestion}
        handleChange={handleChangeDefault}
      />

      <div className={classes.sidebarButtons}>
        <CustomisedButton type="submit" size={'large'} className={classes.saveButton} id="save-question">
          {isNewQuestion ? 'Add question' : 'Update question'}
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

import React, { useContext, useEffect, useState } from 'react';
import useStyles from './EditorCustomiseCode.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { buildFormStructure, exportForm } from '@utils/formHelpers';
import JsonEditor from '@components/mix/JsonEditor/JsonEditor';
import { JSONEditorMode } from 'jsoneditor';
import { NavigationContext } from '@contexts/NavigationContext';
import { VerticalSplit, Spellcheck } from '@material-ui/icons';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import { CustomisedButton } from '@styles/CustomisedButton';
import { ValidationContext } from '@contexts/ValidationContext';
import ErrorsModal from '@components/mix/ErrorsModal/ErrorsModal';
import { useSnackbar } from 'notistack';

const EditorCustomiseCode: React.FC = () => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const { updateFormStructure, getClonedFormStructure, formContext, setFormContext, setFormFile } = useContext(
    FormStructureContext
  );
  const { setEditorCustomiseCodeView } = useContext(NavigationContext);

  const { validateForm, isValid } = useContext(ValidationContext);

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function getExportedForm() {
      const formStructure = getClonedFormStructure();

      const exportedForm = await exportForm(formStructure, formContext);

      setForm(exportedForm);
    }

    getExportedForm();
  }, []);

  const processForm = async (form: any) => {
    const formStructure = await buildFormStructure(form);

    updateFormStructure(formStructure);
    setFormContext(form['@context']);
    setFormFile(form);
    setForm(form);

    return form;
  };

  const onReset = () => {
    enqueueSnackbar(`Changes reset!`, {
      variant: 'error'
    });

    setForm({ ...form });
  };

  const onSave = () => {
    enqueueSnackbar(`Changes saved!`, {
      variant: 'success'
    });

    finishCallback();
  };

  const onValidate = async () => {
    const formToValidate = await finishCallback();

    validateForm(formToValidate);
  };

  const onSwitchToEditorView = () => {
    finishCallback();
    setEditorCustomiseCodeView(false);
  };

  const [finishCallback, setFinishCallback] = useState<any>(null);

  return (
    <>
      <div className={classes.continueButtons}>
        <div className={classes.validateContainer}>
          <CustomisedOutlineButton
            onClick={onValidate}
            className={classes.validateButton}
            variant="outlined"
            title="Save and validate form"
          >
            <Spellcheck />
          </CustomisedOutlineButton>
          {isValid === false ? <ErrorsModal /> : null}
        </div>
        <CustomisedButton className={classes.saveButton} onClick={onSave}>
          Save changes
        </CustomisedButton>
        <CustomisedLinkButton className={classes.resetButton} onClick={onReset}>
          Reset changes
        </CustomisedLinkButton>
        <CustomisedOutlineButton
          variant="outlined"
          title={'Save and edit in editor'}
          className={classes.codeButton}
          onClick={onSwitchToEditorView}
        >
          <VerticalSplit />
        </CustomisedOutlineButton>
      </div>
      <JsonEditor
        form={form}
        processFormCallback={processForm}
        finishFormCallback={setFinishCallback}
        editorOptions={{
          mode: 'code' as JSONEditorMode
        }}
        className={classes.jsonEditor}
      />
    </>
  );
};

export default EditorCustomiseCode;

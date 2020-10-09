import React, { useContext, useEffect, useState } from 'react';
import useStyles from './EditorCustomiseCode.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { buildFormStructure, exportForm } from '@utils/formHelpers';
import JsonEditor from '@components/mix/JsonEditor/JsonEditor';
import { JSONEditorMode } from 'jsoneditor';
import { NavigationContext } from '@contexts/NavigationContext';
import { VerticalSplit } from '@material-ui/icons';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import { CustomisedButton } from '@styles/CustomisedButton';

const EditorCustomiseCode: React.FC = () => {
  const classes = useStyles();

  const { setFormStructure, getClonedFormStructure, formContext, setFormContext, setFormFile } = useContext(
    FormStructureContext
  );
  const { setEditorCustomiseCodeView } = useContext(NavigationContext);

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

    setFormStructure(formStructure);
    setFormContext(form['@context']);
    setFormFile(form);
    setForm(form);
  };

  const onReset = () => {
    setForm({ ...form });
  };

  const onSave = () => {
    finishCallback();
  };

  const onSwitchToEditorView = () => {
    finishCallback();
    setEditorCustomiseCodeView(false);
  };

  const [finishCallback, setFinishCallback] = useState<any>(null);

  return (
    <>
      <div className={classes.continueButtons}>
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

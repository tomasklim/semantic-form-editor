import React, { useContext, useEffect, useState } from 'react';
import useStyles from './EditorCustomizeCode.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { buildFormStructure, exportForm } from '@utils/formHelpers';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import JsonEditor from '@components/mix/JsonEditor/JsonEditor';
import { JSONEditorMode } from 'jsoneditor';
import { NavigationContext } from '@contexts/NavigationContext';

const EditorCustomizeCode: React.FC = () => {
  const classes = useStyles();

  const { setFormStructure, getClonedFormStructure, formContext, setFormContext, setFormFile } = useContext(
    FormStructureContext
  );
  const { setEditorCustomizeCodeView } = useContext(NavigationContext);

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

    setEditorCustomizeCodeView(false);
  };

  const [finishCallback, setFinishCallback] = useState<any>(null);

  // @ts-ignore
  return (
    <>
      <JsonEditor
        form={form}
        processFormCallback={processForm}
        finishFormCallback={setFinishCallback}
        editorOptions={{
          mode: 'code' as JSONEditorMode
        }}
        className={classes.jsonEditor}
      />
      <div className={classes.continueButtons}>
        <CustomisedOutlineButton className={classes.codeButton} variant="outlined" onClick={finishCallback}>
          &nbsp; Save and switch to customize view
        </CustomisedOutlineButton>
      </div>
    </>
  );
};

export default EditorCustomizeCode;

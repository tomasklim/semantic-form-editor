import React, { useContext, useEffect, useState } from 'react';
import useStyles from './EditorCustomizeCode.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';
import { buildFormStructure, exportForm } from '@utils/formHelpers';
import { Code } from '@material-ui/icons';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import JsonEditor from '@components/mix/JsonEditor/JsonEditor';
import { JSONEditorMode } from 'jsoneditor';

const EditorCustomizeCode: React.FC = () => {
  const classes = useStyles();

  const { setFormStructure, getClonedFormStructure, formContext, setFormContext, setFormFile } = useContext(
    FormStructureContext
  );
  const { setCodeEditEnabled } = useContext(EditorContext);

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

    setCodeEditEnabled(false);
  };

  const [finishCallback, setFinishCallback] = useState<any>(null);

  // @ts-ignore
  return (
    <>
      <div className={classes.continueButtons}>
        <CustomisedOutlineButton className={classes.codeButton} variant="outlined" onClick={finishCallback}>
          <Code />
        </CustomisedOutlineButton>
      </div>
      <JsonEditor
        form={form}
        processFormCallback={processForm}
        finishFormCallback={setFinishCallback}
        editorOptions={{
          mode: 'code' as JSONEditorMode
        }}
      />
    </>
  );
};

export default EditorCustomizeCode;

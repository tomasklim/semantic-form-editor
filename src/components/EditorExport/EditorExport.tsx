import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import useStyles, { CustomisedOutlineButton } from './EditorExport.styles';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import { exportForm } from '../../utils/formBuilder';
import { FormStructureContext } from '../../contexts/FormStructureContext';
import { CustomisedButton } from '@components/EditorNew/EditorNew.styles';

interface EditorExportProps {
  resetEditor: () => void;
}

const EditorExport: FC<EditorExportProps> = ({ resetEditor }) => {
  const classes = useStyles();

  const jsonEditorContainer = useRef<any>(null);
  const [jsonEditorInstance, setJsonEditorInstance] = useState<JSONEditor | null>(null);

  const { formContext, getClonedFormStructure } = useContext(FormStructureContext);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function getExportedForm() {
      const formStructure = getClonedFormStructure();

      const exportedForm = await exportForm(formStructure, formContext);

      setForm(exportedForm);
    }

    getExportedForm();
  }, []);

  useEffect(() => {
    const options = {
      mode: 'code' as JSONEditorMode,
      onEditable: () => false
    };

    if (!jsonEditorContainer.current.firstChild) {
      const jsonEditor = new JSONEditor(jsonEditorContainer.current, options);

      setJsonEditorInstance(jsonEditor);
    }

    jsonEditorInstance?.set(form);
  }, [form]);

  const downloadExportedForm = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form)));
    element.setAttribute('download', 'form');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(form));
  };

  return (
    <>
      <div className={classes.newFormButtons}>
        <CustomisedOutlineButton variant="outlined" size="large" onClick={downloadExportedForm}>
          Download
        </CustomisedOutlineButton>
        <span>or</span>
        <CustomisedOutlineButton variant="outlined" size="large" onClick={copyToClipboard}>
          Copy to clipboard
        </CustomisedOutlineButton>
        <span>or</span>
        <span className={classes.italic}>Copy your JSON-LD from form below</span>
      </div>
      <div className={classes.container} ref={jsonEditorContainer} />
      <div className={classes.continueButtons}>
        <CustomisedButton variant="contained" size="large" onClick={resetEditor}>
          Build a new form
        </CustomisedButton>
      </div>
    </>
  );
};

export default EditorExport;

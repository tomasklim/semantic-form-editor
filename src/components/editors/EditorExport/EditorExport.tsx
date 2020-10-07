import React, { FC, useContext, useEffect, useState } from 'react';
import useStyles from './EditorExport.styles';
import { JSONEditorMode } from 'jsoneditor';
import { exportForm } from '@utils/index';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import { CustomisedButton } from '@styles/CustomisedButton';
import 'jsoneditor/dist/jsoneditor.css';
import JsonEditor from '@components/mix/JsonEditor/JsonEditor';

interface EditorExportProps {
  resetEditor: () => void;
}

const EditorExport: FC<EditorExportProps> = ({ resetEditor }) => {
  const classes = useStyles();

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
      <div className={classes.getExportedFormButtons}>
        <CustomisedOutlineButton
          variant="outlined"
          size="large"
          onClick={downloadExportedForm}
          className={classes.buttonWidth}
        >
          Download
        </CustomisedOutlineButton>
        <span>or</span>
        <CustomisedOutlineButton
          variant="outlined"
          size="large"
          onClick={copyToClipboard}
          className={classes.buttonWidth}
        >
          Copy to clipboard
        </CustomisedOutlineButton>
        <span>or</span>
        <span className={classes.italic}>Copy your JSON-LD from form below</span>
      </div>
      <JsonEditor
        form={form}
        editorOptions={{
          mode: 'code' as JSONEditorMode,
          onEditable: () => false
        }}
      />
      <div className={classes.buildNewFormButtonContainer}>
        <CustomisedButton variant="contained" size="large" onClick={resetEditor} className={classes.buttonWidth}>
          Start over
        </CustomisedButton>
      </div>
    </>
  );
};

export default EditorExport;

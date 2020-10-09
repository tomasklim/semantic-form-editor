import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import { JSONEditorMode } from 'jsoneditor';
import useStyles from './EditorNew.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { buildFormStructure, findFormLanguages } from '@utils/index';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import 'jsoneditor/dist/jsoneditor.css';
import { EditorContext } from '@contexts/EditorContext';
import JsonEditor from '@components/mix/JsonEditor/JsonEditor';
import { NavigationContext } from '@contexts/NavigationContext';

interface EditorNewProps {
  nextStep: () => void;
}

const EditorNew: FC<EditorNewProps> = ({ nextStep }) => {
  const classes = useStyles();

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [finishCallback, setFinishCallback] = useState<any>(null);

  const [form, setForm] = useState<any>(null);

  const { resetNavigationContext } = useContext(NavigationContext);
  const { setFormStructure, setFormContext, formFile, setFormFile, resetFormStructureContext } = useContext(
    FormStructureContext
  );
  const { setLanguages, resetEditorContext } = useContext(EditorContext);

  useEffect(() => {
    if (formFile) {
      setForm(formFile);
    }
  }, []);

  const onJsonEditorChange = (): void => {
    setContinueButtonDisabled(false);
  };

  const initialiseNewForm = () => {
    const newForm = require('@data/newForm.json');
    setForm(newForm);
    setContinueButtonDisabled(false);
  };

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      console.warn('No file selected');
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        console.warn('Onload file error');
        return;
      }

      if (e.target.result instanceof ArrayBuffer) {
        console.warn('Cannot process ArrayBuffer');
        return;
      }

      const result = JSON.parse(e.target.result);
      setForm(result);
      setContinueButtonDisabled(false);
    };

    reader.readAsText(file);
  };

  const handleContinueToNextStep = async (form: any) => {
    resetNavigationContext();
    resetFormStructureContext();
    resetEditorContext();

    const formStructure = await buildFormStructure(form);

    const languages = findFormLanguages(formStructure);
    setLanguages(languages);

    setFormStructure(formStructure);
    setFormContext(form['@context']);
    setFormFile(form);

    nextStep();
  };

  return (
    <>
      <div className={classes.newFormButtons}>
        <CustomisedOutlineButton
          variant="outlined"
          onClick={initialiseNewForm}
          size="large"
          className={classes.buttonWidth}
        >
          New form
        </CustomisedOutlineButton>
        <span>or</span>
        <input
          color="primary"
          accept="application/json"
          type="file"
          id="icon-button-file"
          className={classes.uploadFileInput}
          onChange={onFileSelected}
        />
        <label htmlFor="icon-button-file">
          {/* @ts-ignore */}
          <CustomisedOutlineButton variant="outlined" component="span" size="large" className={classes.buttonWidth}>
            Import existing form
          </CustomisedOutlineButton>
        </label>
        <span>or</span>
        <span className={classes.italic}>Paste your JSON-LD form below</span>
      </div>
      <JsonEditor
        form={form}
        editorOptions={{
          mode: 'code' as JSONEditorMode,
          onChange: onJsonEditorChange
        }}
        finishFormCallback={setFinishCallback}
        processFormCallback={handleContinueToNextStep}
      />
      <div className={classes.continueButtons}>
        <CustomisedButton
          className={classes.buttonWidth}
          variant="contained"
          onClick={finishCallback}
          size="large"
          disabled={continueButtonDisabled}
        >
          Save and continue to next step
        </CustomisedButton>
      </div>
    </>
  );
};

export default EditorNew;

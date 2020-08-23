import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from 'react';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import useStyles, { CustomisedButton, CustomisedOutlineButton } from './EditorNew.styles';
import { FormStructureContext } from '../../contexts/FormStructureContext';
import { buildFormStructure } from '../../utils/formBuilder';

interface EditorNewProps {
  nextStep: () => void;
}

const EditorNew: FC<EditorNewProps> = ({ nextStep }) => {
  const classes = useStyles();

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [jsonEditorInstance, setJsonEditorInstance] = useState<JSONEditor | null>(null);
  const jsonEditorContainer = useRef<any>(null);

  const { setFormStructure, setFormContext } = useContext(FormStructureContext);

  useEffect(() => {
    const options = {
      mode: 'code' as JSONEditorMode,
      onChange: onJsonEditorChange
    };

    if (!jsonEditorContainer.current.firstChild) {
      const jsonEditor = new JSONEditor(jsonEditorContainer.current, options);
      setJsonEditorInstance(jsonEditor);
    }
  }, []);

  const onJsonEditorChange = (): void => {
    setContinueButtonDisabled(false);
  };

  const initialiseNewForm = () => {
    const newForm = require('../../utils/newForm.json');
    jsonEditorInstance?.set(newForm);
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
      jsonEditorInstance?.set(result);
      setContinueButtonDisabled(false);
    };

    reader.readAsText(file);
  };

  const handleContinueToNextStep = async () => {
    const form = jsonEditorInstance?.get();

    const formStructure = await buildFormStructure(form);

    setFormStructure(formStructure);
    setFormContext(form['@context']);

    nextStep();
  };

  // @ts-ignore
  return (
    <>
      <div className={classes.newFormButtons}>
        <CustomisedOutlineButton variant="outlined" onClick={initialiseNewForm}>
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
          <CustomisedOutlineButton variant="outlined" component="span">
            Import existing form
          </CustomisedOutlineButton>
        </label>
        <span>or</span>
        <span className={classes.italic}>Paste your form data below</span>
      </div>
      <div className={classes.container} ref={jsonEditorContainer} />
      <div className={classes.continueButtons}>
        <CustomisedButton
          variant="contained"
          onClick={handleContinueToNextStep}
          size="large"
          disabled={continueButtonDisabled}
        >
          Continue to next step
        </CustomisedButton>
      </div>
    </>
  );
};

export default EditorNew;

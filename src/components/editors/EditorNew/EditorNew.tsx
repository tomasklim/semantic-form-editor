import React, { ChangeEvent, FC, useContext, useEffect, useRef, useState } from 'react';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import useStyles from './EditorNew.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { buildFormStructure, findFormLanguages } from '@utils/index';
import { useSnackbar } from 'notistack';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import 'jsoneditor/dist/jsoneditor.css';
import { EditorContext } from '@contexts/EditorContext';

interface EditorNewProps {
  nextStep: () => void;
}

const EditorNew: FC<EditorNewProps> = ({ nextStep }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [jsonEditorInstance, setJsonEditorInstance] = useState<JSONEditor | null>(null);
  const jsonEditorContainer = useRef<any>(null);

  const { setFormStructure, setFormContext, formFile, setFormFile } = useContext(FormStructureContext);
  const { setLanguages } = useContext(EditorContext);

  useEffect(() => {
    const options = {
      mode: 'code' as JSONEditorMode,
      onChange: onJsonEditorChange
    };

    if (!jsonEditorContainer.current.firstChild) {
      const jsonEditor = new JSONEditor(jsonEditorContainer.current, options);
      setJsonEditorInstance(jsonEditor);

      if (formFile) {
        jsonEditor.set(formFile);
      }
    }
  }, []);

  const onJsonEditorChange = (): void => {
    setContinueButtonDisabled(false);
  };

  const initialiseNewForm = () => {
    const newForm = require('@data/newForm.json');
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

  const isFormValid = (form: any) => {
    if (!form['@context'] || !Object.keys(form['@context']).length) {
      enqueueSnackbar('Your JSON-LD form is missing the necessary property @context!', {
        variant: 'error'
      });
      return false;
    }
    if (!form['@graph'] || !Array.isArray(form['@graph']) || !form['@graph'].length) {
      enqueueSnackbar('Your JSON-LD form is missing the necessary property @graph!', {
        variant: 'error'
      });
      return false;
    }
    if (!Object.values(form['@graph']).some((item) => item['has-layout-class'] === 'form')) {
      enqueueSnackbar('Your JSON-LD form is missing the necessary root question with layout-class form!', {
        variant: 'error'
      });
      return false;
    }
    return true;
  };

  const handleContinueToNextStep = async () => {
    let form;
    try {
      form = jsonEditorInstance?.get();
    } catch (err) {
      enqueueSnackbar('There is a syntax error in your JSON-LD form!', {
        variant: 'error'
      });
      setContinueButtonDisabled(true);
      return;
    }

    if (!isFormValid(form)) {
      return;
    }

    const formStructure = await buildFormStructure(form);

    setFormStructure(formStructure);
    setFormContext(form['@context']);
    setFormFile(form);

    const languages = findFormLanguages(formStructure);
    setLanguages(languages);

    nextStep();
  };

  // @ts-ignore
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
      <div className={classes.container} ref={jsonEditorContainer} />
      <div className={classes.continueButtons}>
        <CustomisedButton
          className={classes.buttonWidth}
          variant="contained"
          onClick={handleContinueToNextStep}
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

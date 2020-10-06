import React, { useEffect, useRef, useState } from 'react';
import useStyles from './JsonEditor.styles';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import { useSnackbar } from 'notistack';

interface JsonEditorProps {
  form: any;
  processForm: any;
  finishCallback: any;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ form, processForm, finishCallback }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [jsonEditorInstance, setJsonEditorInstance] = useState<JSONEditor | null>(null);
  const jsonEditorContainer = useRef<any>(null);

  useEffect(() => {
    const options = {
      mode: 'code' as JSONEditorMode
    };

    if (!jsonEditorContainer.current.firstChild) {
      const jsonEditor = new JSONEditor(jsonEditorContainer.current, options);
      setJsonEditorInstance(jsonEditor);
    }
  }, []);

  useEffect(() => {
    jsonEditorInstance?.set(form);
  }, [form]);

  useEffect(() => {
    finishCallback(backToFormCustomise);
  }, [finishCallback]);

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

  const backToFormCustomise = async () => {
    let form;
    try {
      form = jsonEditorInstance?.get();
    } catch (err) {
      enqueueSnackbar('There is a syntax error in your JSON-LD form!', {
        variant: 'error'
      });
      return;
    }

    if (!isFormValid(form)) {
      return;
    }

    processForm();
  };

  return <div className={classes.container} ref={jsonEditorContainer} />;
};

export default JsonEditor;

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import useStyles from './JsonEditor.styles';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import { useSnackbar } from 'notistack';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import classNames from 'classnames';
import { shaclFormValidation } from '@utils/index';

interface JsonEditorProps {
  form: JsonLdObj | null;
  processFormCallback?: (form: JsonLdObj) => void;
  finishFormCallback?: Dispatch<SetStateAction<Function>>;
  editorOptions: JSONEditorOptions;
  className?: string;
  skipErrors?: boolean;
  onError?: () => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  form,
  editorOptions,
  processFormCallback,
  finishFormCallback,
  className,
  skipErrors,
  onError
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [jsonEditorInstance, setJsonEditorInstance] = useState<JSONEditor | null>(null);
  const jsonEditorContainer = useRef<any>(null);

  useEffect(() => {
    if (!jsonEditorContainer.current.firstChild) {
      const jsonEditor = new JSONEditor(jsonEditorContainer.current, editorOptions);
      setJsonEditorInstance(jsonEditor);
    }
  }, []);

  useEffect(() => {
    if (form) {
      jsonEditorInstance?.set(form);
      if (finishFormCallback) {
        finishFormCallback(() => processFormEditor);
      }
    }
  }, [form]);

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

  const processFormEditor = async () => {
    let form;
    try {
      form = jsonEditorInstance?.get();
    } catch (err) {
      enqueueSnackbar('There is a syntax error in your JSON-LD form!', {
        variant: 'error'
      });
      onError && onError();
      return;
    }

    if (!isFormValid(form) && !skipErrors) {
      onError && onError();
      return;
    }

    await shaclFormValidation(form);

    return processFormCallback && processFormCallback(form);
  };

  return <div className={classNames(classes.container, { [className!]: className })} ref={jsonEditorContainer} />;
};

export default JsonEditor;

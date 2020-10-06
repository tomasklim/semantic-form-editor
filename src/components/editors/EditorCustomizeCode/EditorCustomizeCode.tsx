import React, { useContext, useEffect, useRef, useState } from 'react';
import useStyles from './EditorCustomizeCode.styles';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import { useSnackbar } from 'notistack';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';
import { buildFormStructure, exportForm } from '@utils/formHelpers';
import { Code } from '@material-ui/icons';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';

const EditorCustomizeCode: React.FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [jsonEditorInstance, setJsonEditorInstance] = useState<JSONEditor | null>(null);
  const jsonEditorContainer = useRef<any>(null);

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

  useEffect(() => {
    const options = {
      mode: 'code' as JSONEditorMode
    };

    if (form && !jsonEditorContainer.current.firstChild) {
      const jsonEditor = new JSONEditor(jsonEditorContainer.current, options);
      setJsonEditorInstance(jsonEditor);

      jsonEditor.set(form);
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

    const formStructure = await buildFormStructure(form);

    setFormStructure(formStructure);
    setFormContext(form['@context']);
    setFormFile(form);

    setCodeEditEnabled(false);
  };

  // @ts-ignore
  return (
    <>
      <div className={classes.continueButtons}>
        <CustomisedOutlineButton className={classes.codeButton} variant="outlined" onClick={backToFormCustomise}>
          <Code />
        </CustomisedOutlineButton>
      </div>
      <div className={classes.container} ref={jsonEditorContainer} />
    </>
  );
};

export default EditorCustomizeCode;

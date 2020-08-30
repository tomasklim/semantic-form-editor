import { FC, useContext, useEffect, useState } from 'react';
import { FormStructureContext } from '@contexts/FormStructureContext';
import SForms from 's-forms';
import { exportForm } from '@utils/formBuilder';
import useStyles from './EditorPreview.styles';

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
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

  const options = {
    intl: {
      locale: 'en'
    },
    modalView: false,
    horizontalWizardNav: true,
    wizardStepButtons: false,
    enableForwardSkip: true
  };

  if (!form) {
    return null;
  }

  return (
    <div className={classes.container}>
      <SForms
        form={form}
        options={options}
        // @ts-ignore
        fetchTypeAheadValues={() => {}}
      />
    </div>
  );
};

export default EditorPreview;

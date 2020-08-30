import { FC, useContext, useEffect, useState } from 'react';
import { FormStructureContext } from '../../contexts/FormStructureContext';
import SForms from 's-forms';
import { exportForm } from '../../utils/formBuilder';

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
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
    <SForms
      form={form}
      options={options}
      // @ts-ignore
      fetchTypeAheadValues={() => {}}
    />
  );
};

export default EditorPreview;

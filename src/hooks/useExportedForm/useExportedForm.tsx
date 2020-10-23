import { useContext, useEffect, useState } from 'react';
import { exportForm } from '@utils/formHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';

function useExportedForm() {
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

  return form;
}

export default useExportedForm;

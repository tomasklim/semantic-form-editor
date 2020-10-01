import { FC, useContext, useEffect, useState } from 'react';
import SForms from 's-forms';
import { exportForm } from '@utils/index';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './EditorPreview.styles';
import { EditorContext } from '@contexts/EditorContext';
import WizardOrientationSwitch from '@components/mix/WizardOrientationSwitch/WizardOrientationSwitch';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import 's-forms/css/s-forms.min.css';

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
  const classes = useStyles();

  const { formContext, getClonedFormStructure, isWizardless } = useContext(FormStructureContext);
  const { SFormsConfig } = useContext(EditorContext);

  // @ts-ignore
  const [form, setForm] = useState<JsonLdObj>(null);
  const [horizontalWizardNav, setHorizontalWizardNav] = useState<boolean>(true);

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
    horizontalWizardNav,
    wizardStepButtons: false,
    enableForwardSkip: true,
    startingQuestionId: SFormsConfig.startingQuestionId
  };

  const fetchTypeaheadValuesMock = (_: string): Promise<object> => {
    const possibleValues = require('@data/possibleValuesMock.json');
    return new Promise((resolve) => setTimeout(() => resolve(possibleValues), 1500));
  };

  const handleWizardTypeChange = () => {
    setHorizontalWizardNav(!horizontalWizardNav);
  };

  if (!form) {
    return null;
  }

  return (
    <div className={classes.previewContainer}>
      {isWizardless === false && (
        <WizardOrientationSwitch
          handleWizardTypeChange={handleWizardTypeChange}
          horizontalWizardNav={horizontalWizardNav}
        />
      )}
      <SForms form={form} options={options} fetchTypeAheadValues={fetchTypeaheadValuesMock} />
    </div>
  );
};

export default EditorPreview;

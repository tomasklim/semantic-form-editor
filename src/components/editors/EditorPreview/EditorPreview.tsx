import { FC, useContext, useEffect, useState } from 'react';
import SForms, { SOptions } from 's-forms';
import { exportForm, getIntl } from '@utils/index';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './EditorPreview.styles';
import { EditorContext } from '@contexts/EditorContext';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import 's-forms/css/s-forms.min.css';
import PreviewConfig from '@components/mix/PreviewConfig/PreviewConfig';
import { IIntl } from '@interfaces/index';

const fetchTypeaheadValuesMock = (_: string): Promise<object> => {
  const possibleValues = require('@data/possibleValuesMock.json');

  return new Promise((resolve) => setTimeout(() => resolve(possibleValues), 1500));
};

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
  const classes = useStyles();

  const { formContext, getClonedFormStructure } = useContext(FormStructureContext);
  const { SFormsConfig, languages } = useContext(EditorContext);

  const [form, setForm] = useState<JsonLdObj>();
  const [horizontalWizardNav, setHorizontalWizardNav] = useState<boolean>(true);
  const [intl, setIntl] = useState<IIntl>(languages.length ? getIntl(languages[0]) : {});

  useEffect(() => {
    async function getExportedForm() {
      const formStructure = getClonedFormStructure();

      const exportedForm = await exportForm(formStructure, formContext);

      setForm(exportedForm);
    }

    getExportedForm();
  }, []);

  const options: SOptions = {
    modalView: false,
    horizontalWizardNav,
    wizardStepButtons: false,
    enableForwardSkip: true,
    startingQuestionId: SFormsConfig.startingQuestionId
  };

  if (intl) {
    // @ts-ignore
    options.intl = intl;
  }

  if (!form) {
    return null;
  }

  return (
    <div className={classes.previewContainer}>
      <PreviewConfig
        horizontalWizardNav={horizontalWizardNav}
        setHorizontalWizardNav={setHorizontalWizardNav}
        intl={intl}
        setIntl={setIntl}
      />
      <SForms form={form} options={options} fetchTypeAheadValues={fetchTypeaheadValuesMock} />
    </div>
  );
};

export default EditorPreview;

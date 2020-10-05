import { FC, useContext, useEffect, useState } from 'react';
import SForms, { SOptions } from 's-forms';
import { exportForm } from '@utils/index';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './EditorPreview.styles';
import { EditorContext } from '@contexts/EditorContext';
import WizardOrientationSwitch from '@components/mix/WizardOrientationSwitch/WizardOrientationSwitch';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import 's-forms/css/s-forms.min.css';
import { FormControl, InputLabel, Select } from '@material-ui/core';

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
  const classes = useStyles();

  const { formContext, getClonedFormStructure, isWizardless } = useContext(FormStructureContext);
  const { SFormsConfig } = useContext(EditorContext);
  const { languages } = useContext(EditorContext);

  // @ts-ignore
  const [form, setForm] = useState<JsonLdObj>(null);
  const [horizontalWizardNav, setHorizontalWizardNav] = useState<boolean>(true);
  const [intl, setIntl] = useState<{ locale: string } | null>(languages.length ? { locale: languages[0] } : null);

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
    options.intl = intl;
  }

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
      <div className={classes.previewConfig}>
        {!isWizardless && (
          <WizardOrientationSwitch
            handleWizardTypeChange={handleWizardTypeChange}
            horizontalWizardNav={horizontalWizardNav}
          />
        )}
        {languages.length && (
          <FormControl>
            <InputLabel>Language</InputLabel>
            <Select
              native
              value={intl?.locale}
              onChange={(e) => setIntl({ locale: (e.target.value as unknown) as string })}
            >
              {languages.map((language) => (
                <option value={language}>{language.toUpperCase()}</option>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <SForms form={form} options={options} fetchTypeAheadValues={fetchTypeaheadValuesMock} />
    </div>
  );
};

export default EditorPreview;

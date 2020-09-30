import { FC, useContext, useEffect, useState } from 'react';
import { FormStructureContext } from '@contexts/FormStructureContext';
import SForms from 's-forms';
import { exportForm } from '@utils/index';
import useStyles from './EditorPreview.styles';
import { EditorContext } from '@contexts/EditorContext';
import { Grid } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
  const classes = useStyles();

  const { formContext, getClonedFormStructure, isWizardless } = useContext(FormStructureContext);
  const { SFormsConfig } = useContext(EditorContext);

  const [form, setForm] = useState<any>(null);
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

  const handleWizardTypeChange = () => {
    setHorizontalWizardNav(!horizontalWizardNav);
  };

  if (!form) {
    return null;
  }

  return (
    <div className={classes.container}>
      {isWizardless === false && (
        <div className={classes.switchContainer}>
          <span>Navigation</span>
          <Grid component="label" container spacing={1} className={classes.switch}>
            <Grid item>Horizontal</Grid>
            <Grid item>
              <CustomisedSwitch checked={horizontalWizardNav} onChange={handleWizardTypeChange} name="checkedC" />
            </Grid>
            <Grid item>Vertical</Grid>
          </Grid>
        </div>
      )}
      {horizontalWizardNav ? (
        <SForms
          form={form}
          options={options}
          // @ts-ignore
          fetchTypeAheadValues={() => {}}
        />
      ) : (
        <SForms
          form={form}
          options={options}
          // @ts-ignore
          fetchTypeAheadValues={() => {}}
        />
      )}
    </div>
  );
};

export default EditorPreview;

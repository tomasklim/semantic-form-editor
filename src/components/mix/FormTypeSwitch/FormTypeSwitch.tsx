import { Grid, Tooltip } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';
import useStyles from './FormTypeSwitch.styles';
import HelpIcon from '@material-ui/icons/Help';
import React, { useContext } from 'react';
import { FormStructureContext } from '@contexts/FormStructureContext';
import classNames from 'classnames';
import { transformToSimpleForm, transformToWizardForm } from '@utils/formHelpers';
import { useSnackbar } from 'notistack';

interface FormTypeSwitchProps {
  cloneConfigModal: () => void;
}

const FormTypeSwitch: React.FC<FormTypeSwitchProps> = ({ cloneConfigModal }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { isEmptyFormStructure, isWizardless, setIsWizardless, formStructure, updateFormStructure } = useContext(
    FormStructureContext
  );

  const handleFormTypeChange = () => {
    setIsWizardless(!isWizardless);
  };

  const transformFormType = () => {
    if (isWizardless) {
      transformToWizardForm(formStructure);
    } else {
      transformToSimpleForm(formStructure);
    }

    updateFormStructure(formStructure);
    cloneConfigModal();

    enqueueSnackbar(`Form type changed!`, {
      variant: 'success'
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.switchContainer}>
        <Grid component="label" container spacing={1} className={classes.switch}>
          <Grid item>
            <Tooltip
              title="Wizard form is a form type, where the form is divided into multiple steps having one step per one screen.
            It uses wizard which alows a user to navigate directly between specific steps without completing the previous steps."
            >
              <HelpIcon fontSize={'small'} />
            </Tooltip>
            &nbsp;Wizard form
          </Grid>
          <Grid item className={classNames({ [classes.switchDisabled]: !isEmptyFormStructure })}>
            <CustomisedSwitch
              checked={isWizardless}
              onChange={isEmptyFormStructure ? handleFormTypeChange : transformFormType}
            />
          </Grid>
          <Grid item>
            Classic form&nbsp;
            <Tooltip title="Classic form is a form type, where all questions are displayed on one screen at a time. The respondent can scroll to navigate between questions.">
              <HelpIcon fontSize={'small'} />
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default FormTypeSwitch;

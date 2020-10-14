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

  const {
    isEmptyFormStructure,
    isWizardless,
    setIsWizardless,
    getClonedFormStructure,
    updateFormStructure
  } = useContext(FormStructureContext);

  const handleFormTypeChange = () => {
    setIsWizardless(!isWizardless);
  };

  const transformFormType = () => {
    const clonedFormStructure = getClonedFormStructure();
    if (isWizardless) {
      transformToWizardForm(clonedFormStructure);
    } else {
      transformToSimpleForm(clonedFormStructure);
    }

    updateFormStructure(clonedFormStructure);
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
            <Tooltip title="Editor allows you to create a form with wizard. That means that your form can consist of more pages.">
              <HelpIcon fontSize={'small'} />
            </Tooltip>
            &nbsp;Wizard form
          </Grid>
          <Grid item className={classNames({ [classes.switchDisabled]: !isEmptyFormStructure })}>
            <CustomisedSwitch checked={isWizardless} onChange={handleFormTypeChange} disabled={!isEmptyFormStructure} />
          </Grid>
          <Grid item>
            Simple form&nbsp;
            <Tooltip title="Editor allows you to create one page simple form.">
              <HelpIcon fontSize={'small'} />
            </Tooltip>
          </Grid>
        </Grid>
      </div>
      {!isEmptyFormStructure && (
        <div className={classes.transformForm}>
          To change form type, transform the form by{' '}
          <button className={classes.transformFormClick} onClick={transformFormType}>
            clicking here
          </button>
          .
        </div>
      )}
    </div>
  );
};

export default FormTypeSwitch;

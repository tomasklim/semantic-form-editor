import { Grid, Tooltip } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';
import useStyles from './FormTypeSwitch.styles';
import HelpIcon from '@material-ui/icons/Help';
import React, { useContext } from 'react';
import { FormStructureContext } from '@contexts/FormStructureContext';
import classNames from 'classnames';
import { transformToSimpleForm, transformToWizardForm } from '@utils/formHelpers';

interface FormTypeSwitchProps {
  cloneConfigModal: () => void;
}

const FormTypeSwitch: React.FC<FormTypeSwitchProps> = ({ cloneConfigModal }) => {
  const classes = useStyles();

  const { isEmptyFormStructure, isWizardless, setIsWizardless, getClonedFormStructure, setFormStructure } = useContext(
    FormStructureContext
  );

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

    setFormStructure(clonedFormStructure);
    cloneConfigModal();
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
          <span className={classes.transformFormClick} onClick={transformFormType}>
            clicking here
          </span>
          .
        </div>
      )}
    </div>
  );
};

export default FormTypeSwitch;

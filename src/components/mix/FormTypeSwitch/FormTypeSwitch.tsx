import React from 'react';
import { Grid, Tooltip } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';
import useStyles from './FormTypeSwitch.styles';
import HelpIcon from '@material-ui/icons/Help';

interface FormTypeSwitchProps {
  isWizardlessFormType: boolean;
  handleFormTypeChange: () => void;
}

const FormTypeSwitch: React.FC<FormTypeSwitchProps> = ({ isWizardlessFormType, handleFormTypeChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.switchContainer}>
      <Grid component="label" container spacing={1} className={classes.switch}>
        <Grid item>
          <Tooltip title="Editor allows you to create a form with wizard. That means that your form can consist of more pages.">
            <HelpIcon fontSize={'small'} />
          </Tooltip>
          &nbsp;Wizard form
        </Grid>
        <Grid item>
          <CustomisedSwitch checked={isWizardlessFormType} onChange={handleFormTypeChange} />
        </Grid>
        <Grid item>
          Simple form&nbsp;
          <Tooltip title="Editor allows you to create one page simple form.">
            <HelpIcon fontSize={'small'} />
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
};

export default FormTypeSwitch;

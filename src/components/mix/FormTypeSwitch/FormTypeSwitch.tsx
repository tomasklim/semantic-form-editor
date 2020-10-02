import React from 'react';
import { Grid } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';
import useStyles from './FormTypeSwitch.styles';

interface FormTypeSwitchProps {
  isWizardlessFormType: boolean;
  handleFormTypeChange: () => void;
}

const FormTypeSwitch: React.FC<FormTypeSwitchProps> = ({ isWizardlessFormType, handleFormTypeChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.switchContainer}>
      <Grid component="label" container spacing={1} className={classes.switch}>
        <Grid item>Multiple pages form</Grid>
        <Grid item>
          <CustomisedSwitch checked={isWizardlessFormType} onChange={handleFormTypeChange} />
        </Grid>
        <Grid item>One page form</Grid>
      </Grid>
    </div>
  );
};

export default FormTypeSwitch;

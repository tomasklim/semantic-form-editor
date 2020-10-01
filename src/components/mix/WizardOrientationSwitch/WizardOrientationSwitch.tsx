import React from 'react';
import { Grid } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';
import useStyles from './WizardOrientationSwitch.styles';

interface WizardOrientationSwitchProps {
  horizontalWizardNav: boolean;
  handleWizardTypeChange: () => void;
}

const WizardOrientationSwitch: React.FC<WizardOrientationSwitchProps> = ({
  horizontalWizardNav,
  handleWizardTypeChange
}) => {
  const classes = useStyles();

  return (
    <div className={classes.switchContainer}>
      <span>Navigation</span>
      <Grid component="label" container spacing={1} className={classes.switch}>
        <Grid item>Horizontal</Grid>
        <Grid item>
          <CustomisedSwitch checked={horizontalWizardNav} onChange={handleWizardTypeChange} />
        </Grid>
        <Grid item>Vertical</Grid>
      </Grid>
    </div>
  );
};

export default WizardOrientationSwitch;

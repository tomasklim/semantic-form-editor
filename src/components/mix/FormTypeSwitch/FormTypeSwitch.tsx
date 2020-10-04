import { Grid, Tooltip } from '@material-ui/core';
import CustomisedSwitch from '@styles/CustomisedSwitch';
import useStyles from './FormTypeSwitch.styles';
import HelpIcon from '@material-ui/icons/Help';
import React, { useContext } from 'react';
import { FormStructureContext } from '@contexts/FormStructureContext';

interface FormTypeSwitchProps {}

const FormTypeSwitch: React.FC<FormTypeSwitchProps> = ({}) => {
  const classes = useStyles();

  const { isEmptyFormStructure, isWizardless, setIsWizardless } = useContext(FormStructureContext);

  const handleFormTypeChange = () => {
    setIsWizardless(!isWizardless);
  };

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
  );
};

export default FormTypeSwitch;

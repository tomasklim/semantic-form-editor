import { Step } from '@material-ui/core';
import React, { useContext } from 'react';
import useStyles from './StepperBar.styles';
import { CustomisedConnector, CustomisedStepIcon, CustomisedStepLabel, CustomisedStepper } from './StepperBar.styles';
import classNames from 'classnames';
import { EditorContext } from '@contexts/EditorContext';

interface StepperBarProps {
  lockedSteps: boolean;
}

const StepperBar: React.FC<StepperBarProps> = ({ lockedSteps }) => {
  const classes = useStyles();

  const { activeStep, setActiveStep } = useContext(EditorContext);

  const steps = ['New / Import', 'Customize', 'Preview', 'Export'];

  const handleStepClick = (index: number): void => {
    if (!lockedSteps) {
      setActiveStep(index);
    }
  };

  return (
    <div className={classes.stepperBar}>
      <CustomisedStepper
        activeStep={activeStep}
        connector={<CustomisedConnector />}
        className={classNames({ [classes.unlockedSteps]: !lockedSteps })}
      >
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)}>
            <CustomisedStepLabel StepIconComponent={CustomisedStepIcon}>{label}</CustomisedStepLabel>
          </Step>
        ))}
      </CustomisedStepper>
    </div>
  );
};

export default StepperBar;

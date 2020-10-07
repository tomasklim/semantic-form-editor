import { Step } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import useStyles, {
  CustomisedConnector,
  CustomisedStepIcon,
  CustomisedStepLabel,
  CustomisedStepper
} from './StepperBar.styles';
import classNames from 'classnames';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { NavigationContext } from '@contexts/NavigationContext';

const StepperBar: React.FC = () => {
  const classes = useStyles();

  const { steps, activeStep, setActiveStep, unlockedSteps, setUnlockedSteps, unlockAllSteps } = useContext(
    NavigationContext
  );
  const { isEmptyFormStructure } = useContext(FormStructureContext);

  useEffect(() => {
    if (isEmptyFormStructure && activeStep === 1) {
      setUnlockedSteps([0, 1]);
    } else if (!isEmptyFormStructure) {
      unlockAllSteps();
    }
  }, [isEmptyFormStructure]);

  const handleStepClick = (index: number): void => {
    if (unlockedSteps.includes(index)) {
      setActiveStep(index);
    }
  };

  return (
    <div className={classes.stepperBar}>
      <CustomisedStepper activeStep={activeStep} connector={<CustomisedConnector />}>
        {steps.map((label, index) => (
          <Step
            key={label}
            onClick={() => handleStepClick(index)}
            className={classNames({ [classes.unlockedStep]: unlockedSteps.includes(index) })}
          >
            <CustomisedStepLabel StepIconComponent={CustomisedStepIcon}>{label}</CustomisedStepLabel>
          </Step>
        ))}
      </CustomisedStepper>
    </div>
  );
};

export default StepperBar;

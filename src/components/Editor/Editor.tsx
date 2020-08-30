import React, { FC } from 'react';
import classnames from 'classnames';
import useStyles, {
  CustomisedConnector,
  CustomisedStepIcon,
  CustomisedStepLabel,
  CustomisedStepper
} from './Editor.styles';
import { Step } from '@material-ui/core';
import EditorCustomize from '@components/EditorCustomize/EditorCustomize';
import EditorPreview from '@components/EditorPreview/EditorPreview';
import EditorNew from '@components/EditorNew/EditorNew';

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['New / Import', 'Customize', 'Preview', 'Export'];
  const [unlockedSteps, unlockSteps] = React.useState(false);

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <EditorNew nextStep={moveToCustomiseStep} />;
      case 1:
        return <EditorCustomize />;
      case 2:
        return <EditorPreview />;
      case 3:
        return <div />;
    }
  };

  const handleStepClick = (index: number): void => {
    if (unlockedSteps) {
      setActiveStep(index);
    }
  };

  const moveToCustomiseStep = () => {
    setActiveStep(1);
    unlockSteps(true);
  };

  return (
    <>
      <div className={classes.stepperBar}>
        <CustomisedStepper
          activeStep={activeStep}
          connector={<CustomisedConnector />}
          className={classnames({ [classes.unlockedStep]: unlockedSteps })}
        >
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepClick(index)}>
              <CustomisedStepLabel StepIconComponent={CustomisedStepIcon}>{label}</CustomisedStepLabel>
            </Step>
          ))}
        </CustomisedStepper>
      </div>
      {getStepContent()}
    </>
  );
};

export default Editor;

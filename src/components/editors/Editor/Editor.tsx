import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { Step } from '@material-ui/core';
import useStyles, {
  CustomisedConnector,
  CustomisedStepIcon,
  CustomisedStepLabel,
  CustomisedStepper
} from './Editor.styles';
import EditorCustomize from '@components/editors/EditorCustomize/EditorCustomize';
import EditorPreview from '@components/editors/EditorPreview/EditorPreview';
import EditorNew from '@components/editors/EditorNew/EditorNew';
import EditorExport from '@components/editors/EditorExport/EditorExport';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionProvider } from '@contexts/CustomiseQuestionContext';
import { EditorContext } from '@contexts/EditorContext';

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const classes = useStyles();

  const { setFormFile } = useContext(FormStructureContext);
  const { activeStep, setActiveStep } = useContext(EditorContext);

  const steps = ['New / Import', 'Customize', 'Preview', 'Export'];

  const [lockedSteps, setLockedSteps] = React.useState<boolean>(true);

  const handleStepClick = (index: number): void => {
    if (!lockedSteps) {
      setActiveStep(index);
    }
  };

  const moveToCustomiseStep = () => {
    setActiveStep(1);
    setLockedSteps(false);
  };

  const resetEditor = () => {
    setLockedSteps(true);
    setActiveStep(0);
    setFormFile(null);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <EditorNew nextStep={moveToCustomiseStep} />;
      case 1:
        return (
          <CustomiseQuestionProvider>
            <EditorCustomize />
          </CustomiseQuestionProvider>
        );
      case 2:
        return <EditorPreview />;
      case 3:
        return <EditorExport resetEditor={resetEditor} />;
    }
  };

  const stepContent = getStepContent();

  return (
    <>
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
      {stepContent}
    </>
  );
};

export default Editor;

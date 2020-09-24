import React, { FC, useContext } from 'react';
import classnames from 'classnames';
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
import { CustomiseItemProvider } from '@contexts/CustomiseItemContext';
import { EditorContext } from '@contexts/EditorContext';

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const classes = useStyles();

  const { setFormFile } = useContext(FormStructureContext);
  const { activeStep, setActiveStep } = useContext(EditorContext);

  const steps = ['New / Import', 'Customize', 'Preview', 'Export'];

  const [unlockedSteps, unlockSteps] = React.useState(false);

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <EditorNew nextStep={moveToCustomiseStep} />;
      case 1:
        return (
          <CustomiseItemProvider>
            <EditorCustomize />
          </CustomiseItemProvider>
        );
      case 2:
        return <EditorPreview />;
      case 3:
        return <EditorExport resetEditor={resetEditor} />;
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

  const resetEditor = () => {
    unlockSteps(false);
    setActiveStep(0);
    // @ts-ignore
    setFormFile(null);
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

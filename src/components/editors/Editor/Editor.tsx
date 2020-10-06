import React, { FC, useContext, useEffect } from 'react';
import EditorCustomize from '@components/editors/EditorCustomize/EditorCustomize';
import EditorPreview from '@components/editors/EditorPreview/EditorPreview';
import EditorNew from '@components/editors/EditorNew/EditorNew';
import EditorExport from '@components/editors/EditorExport/EditorExport';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionProvider } from '@contexts/CustomiseQuestionContext';
import { EditorContext } from '@contexts/EditorContext';
import StepperBar from '@components/mix/StepperBar/StepperBar';
import EditorCustomizeCode from '@components/editors/EditorCustomizeCode/EditorCustomizeCode';

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const { setFormFile } = useContext(FormStructureContext);
  const { activeStep, setActiveStep, setCodeEditEnabled, codeEditEnabled } = useContext(EditorContext);

  const [lockedSteps, setLockedSteps] = React.useState<boolean>(true);

  useEffect(() => {
    if (codeEditEnabled && activeStep !== 1) {
      setCodeEditEnabled(false);
    }
  }, [activeStep]);

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
        return !codeEditEnabled ? (
          <CustomiseQuestionProvider>
            <EditorCustomize />
          </CustomiseQuestionProvider>
        ) : (
          <EditorCustomizeCode />
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
      <StepperBar lockedSteps={lockedSteps} />
      {stepContent}
    </>
  );
};

export default Editor;

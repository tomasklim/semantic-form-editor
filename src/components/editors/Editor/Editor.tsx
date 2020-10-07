import React, { FC, useContext, useEffect } from 'react';
import EditorCustomize from '@components/editors/EditorCustomize/EditorCustomize';
import EditorPreview from '@components/editors/EditorPreview/EditorPreview';
import EditorNew from '@components/editors/EditorNew/EditorNew';
import EditorExport from '@components/editors/EditorExport/EditorExport';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionProvider } from '@contexts/CustomiseQuestionContext';
import StepperBar from '@components/mix/StepperBar/StepperBar';
import EditorCustomizeCode from '@components/editors/EditorCustomizeCode/EditorCustomizeCode';
import { NavigationContext } from '@contexts/NavigationContext';

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const { setFormFile } = useContext(FormStructureContext);

  const {
    activeStep,
    setActiveStep,
    resetSteps,
    unlockStep,
    editorCustomizeCodeView,
    setEditorCustomizeCodeView
  } = useContext(NavigationContext);

  useEffect(() => {
    if (editorCustomizeCodeView && activeStep !== 1) {
      setEditorCustomizeCodeView(false);
    }
  }, [activeStep]);

  const moveToCustomiseStep = () => {
    setActiveStep(1);
    unlockStep(1);
  };

  const resetEditor = () => {
    resetSteps();
    setFormFile(null);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <EditorNew nextStep={moveToCustomiseStep} />;
      case 1:
        return !editorCustomizeCodeView ? (
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
      <StepperBar />
      {stepContent}
    </>
  );
};

export default Editor;

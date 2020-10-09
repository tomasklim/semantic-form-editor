import React, { FC, useContext, useEffect } from 'react';
import EditorCustomise from '@components/editors/EditorCustomise/EditorCustomise';
import EditorPreview from '@components/editors/EditorPreview/EditorPreview';
import EditorNew from '@components/editors/EditorNew/EditorNew';
import EditorExport from '@components/editors/EditorExport/EditorExport';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionProvider } from '@contexts/CustomiseQuestionContext';
import StepperBar from '@components/mix/StepperBar/StepperBar';
import EditorCustomiseCode from '@components/editors/EditorCustomiseCode/EditorCustomiseCode';
import { NavigationContext } from '@contexts/NavigationContext';
import { EditorContext } from '@contexts/EditorContext';

interface EditorProps {}

const Editor: FC<EditorProps> = ({}) => {
  const { resetFormStructureContext } = useContext(FormStructureContext);

  const {
    activeStep,
    setActiveStep,
    resetNavigationContext,
    unlockStep,
    editorCustomiseCodeView,
    setEditorCustomiseCodeView
  } = useContext(NavigationContext);

  const { setSectionsExpanded, resetEditorContext } = useContext(EditorContext);

  useEffect(() => {
    if (editorCustomiseCodeView && activeStep !== 1) {
      setEditorCustomiseCodeView(false);
    }
  }, [activeStep]);

  useEffect(() => {
    setSectionsExpanded(true);
  }, [activeStep, editorCustomiseCodeView]);

  const moveToCustomiseStep = () => {
    setActiveStep(1);
    unlockStep(1);
  };

  const resetEditor = () => {
    resetFormStructureContext();
    resetNavigationContext();
    resetEditorContext();
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <EditorNew nextStep={moveToCustomiseStep} />;
      case 1:
        return !editorCustomiseCodeView ? (
          <CustomiseQuestionProvider>
            <EditorCustomise />
          </CustomiseQuestionProvider>
        ) : (
          <EditorCustomiseCode />
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

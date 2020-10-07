import React, { Dispatch, SetStateAction } from 'react';

interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavigationContextValues {
  steps: Array<string>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  unlockedSteps: Array<number>;
  setUnlockedSteps: Dispatch<SetStateAction<Array<number>>>;
  unlockAllSteps: () => void;
  resetSteps: () => void;
  unlockStep: (step: number) => void;

  showFormConfigurationModal: boolean;
  setShowFormConfigurationModal: Dispatch<SetStateAction<boolean>>;
  editorCustomizeCodeView: boolean;
  setEditorCustomizeCodeView: Dispatch<SetStateAction<boolean>>;
}

const INITIAL_UNLOCKED_STEPS = [0];

// @ts-ignore
const NavigationContext = React.createContext<NavigationContextValues>({});

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [showFormConfigurationModal, setShowFormConfigurationModal] = React.useState<boolean>(false);
  const [editorCustomizeCodeView, setEditorCustomizeCodeView] = React.useState<boolean>(false);

  const steps = ['New / Import', 'Customize', 'Preview', 'Export'];

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [unlockedSteps, setUnlockedSteps] = React.useState<Array<number>>(INITIAL_UNLOCKED_STEPS);

  const allStepsUnlocked = steps.map((_, index) => {
    return index;
  });

  const unlockAllSteps = () => {
    setUnlockedSteps(allStepsUnlocked);
  };

  const resetSteps = () => {
    setActiveStep(0);
    setUnlockedSteps(INITIAL_UNLOCKED_STEPS);
  };

  const unlockStep = (index: number) => {
    unlockedSteps.push(index);
  };

  const values = React.useMemo<NavigationContextValues>(
    () => ({
      steps,
      activeStep,
      setActiveStep,
      unlockedSteps,
      setUnlockedSteps,
      unlockAllSteps,
      resetSteps,
      unlockStep,
      showFormConfigurationModal,
      setShowFormConfigurationModal,
      editorCustomizeCodeView,
      setEditorCustomizeCodeView
    }),
    [activeStep, unlockedSteps, showFormConfigurationModal, editorCustomizeCodeView]
  );

  return <NavigationContext.Provider value={values}>{children}</NavigationContext.Provider>;
};

export { NavigationContext, NavigationProvider };

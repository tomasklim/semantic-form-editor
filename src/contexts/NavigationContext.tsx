import React, { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

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
  resetNavigationContext: () => void;
  unlockStep: (step: number) => void;

  showFormConfigurationModal: boolean;
  setShowFormConfigurationModal: Dispatch<SetStateAction<boolean>>;
  editorCustomiseCodeView: boolean;
  setEditorCustomiseCodeView: Dispatch<SetStateAction<boolean>>;
}

const INITIAL_UNLOCKED_STEPS = [0];

const STEPS_LOCAL_FORM = ['New / Import', 'Customise', 'Preview', 'Export'];
const STEPS_REMOTE_FORM = ['Fetch', 'Customise', 'Preview', 'Publish'];

// @ts-ignore
const NavigationContext = React.createContext<NavigationContextValues>({});

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const router = useRouter();

  let steps: string[];
  if (router.query.formUrl) {
    steps = STEPS_REMOTE_FORM;
  } else {
    steps = STEPS_LOCAL_FORM;
  }

  const [showFormConfigurationModal, setShowFormConfigurationModal] = React.useState<boolean>(false);
  const [editorCustomiseCodeView, setEditorCustomiseCodeView] = React.useState<boolean>(false);

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [unlockedSteps, setUnlockedSteps] = React.useState<Array<number>>([...INITIAL_UNLOCKED_STEPS]);

  const allStepsUnlocked = STEPS_LOCAL_FORM.map((_, index) => {
    if (router.query.formUrl && index === 0) {
      return -1;
    }
    return index;
  });

  const unlockAllSteps = () => {
    setUnlockedSteps(allStepsUnlocked);
  };

  const resetNavigationContext = () => {
    setActiveStep(0);
    setUnlockedSteps([...INITIAL_UNLOCKED_STEPS]);
    setShowFormConfigurationModal(false);
    setEditorCustomiseCodeView(false);
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
      resetNavigationContext,
      unlockStep,
      showFormConfigurationModal,
      setShowFormConfigurationModal,
      editorCustomiseCodeView,
      setEditorCustomiseCodeView
    }),
    [activeStep, unlockedSteps, showFormConfigurationModal, editorCustomiseCodeView]
  );

  return <NavigationContext.Provider value={values}>{children}</NavigationContext.Provider>;
};

export { NavigationContext, NavigationProvider };

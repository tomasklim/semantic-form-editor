import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import AddIcon from '@material-ui/icons/Add';
import React, { useContext, useRef } from 'react';
import { NEW_QUESTION, NEW_WIZARD_SECTION_QUESTION } from '@constants/index';
import { CustomiseQuestionContext, OnSaveQuestionsCallback } from '@contexts/CustomiseQuestionContext';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './SIdebarNav.styles';
import ConfigModal from '@components/mix/ConfigModal/ConfigModal';
import { EditorContext } from '@contexts/EditorContext';
import SidebarDroparea from '@components/sidebars/SidebarDroparea/SidebarDroparea';

const SidebarNav = ({}) => {
  const classes = useStyles();

  const addButton = useRef<HTMLButtonElement | null>(null);

  const { getClonedFormStructure, addNewNodes, isWizardless, isEmptyFormStructure } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);
  const { intl } = useContext(EditorContext);

  const addNewTopLevelQuestion = () => {
    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.warn('Missing root', clonedFormStructure);
      return;
    }

    customiseQuestion({
      customisingQuestion: !isWizardless ? { ...NEW_WIZARD_SECTION_QUESTION } : { ...NEW_QUESTION },
      onSave: (): OnSaveQuestionsCallback => (questions) => addNewNodes(questions, root, clonedFormStructure, intl),
      onCancel: () => () => addButton.current?.classList.remove(classes.buttonHighlight),
      onInit: () => addButton.current?.classList.add(classes.buttonHighlight),
      isNewQuestion: true,
      level: 0
    });
  };

  return (
    <>
      <div className={classes.sidebarNav}>
        <CustomisedOutlineButton
          onClick={!isEmptyFormStructure ? addNewTopLevelQuestion : undefined}
          title={!isWizardless ? 'Add new wizard step' : 'Add new question'}
          ref={addButton}
          startIcon={<AddIcon />}
          variant="outlined"
          id="new-question-button"
        >
          {!isWizardless ? 'Add new wizard step' : 'Add new question'}
        </CustomisedOutlineButton>
        <ConfigModal />
      </div>
      <SidebarDroparea />
    </>
  );
};

export default SidebarNav;

import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import AddIcon from '@material-ui/icons/Add';
import React, { useContext, useRef } from 'react';
import { NEW_QUESTION, NEW_WIZARD_SECTION_QUESTION } from '@constants/index';
import { CustomiseQuestion, OnSaveQuestionsCallback } from '@contexts/CustomiseQuestionContext';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './SidebarNav.styles';
import ConfigModal from '@components/mix/ConfigModal/ConfigModal';
import { EditorContext } from '@contexts/EditorContext';
import SidebarDroparea from '@components/sidebars/SidebarDroparea/SidebarDroparea';
import { Code, ExpandLess, ExpandMore, Spellcheck } from '@material-ui/icons';
import { NavigationContext } from '@contexts/NavigationContext';
import { exportForm } from '@utils/formHelpers';
import { ValidationContext } from '@contexts/ValidationContext';

interface SidebarNavProps {
  customiseQuestion: CustomiseQuestion;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ customiseQuestion }) => {
  const classes = useStyles();

  const addButton = useRef<HTMLButtonElement | null>(null);

  const { getClonedFormStructure, formContext, addNewNodes, isWizardless, isEmptyFormStructure } = useContext(
    FormStructureContext
  );
  const { intl, setSectionsExpanded, sectionsExpanded } = useContext(EditorContext);

  const { editorCustomiseCodeView, setEditorCustomiseCodeView } = useContext(NavigationContext);
  const { validateForm } = useContext(ValidationContext);

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
      nestedLevel: 0
    });
  };

  const handleSectionsExpansion = () => {
    setSectionsExpanded(!sectionsExpanded);
  };

  const switchToCodeEditor = () => {
    setEditorCustomiseCodeView(!editorCustomiseCodeView);
  };

  const handleValidateForm = async () => {
    const formStructure = getClonedFormStructure();

    const exportedForm = await exportForm(formStructure, formContext);

    validateForm(exportedForm);
  };

  return (
    <>
      <div className={classes.sidebarNav}>
        <CustomisedOutlineButton
          onClick={!isEmptyFormStructure ? addNewTopLevelQuestion : undefined}
          title={!isWizardless ? 'Add new wizard step' : 'Add new question'}
          id={!isWizardless ? 'add-new-wizard-step-button' : 'add-new-question'}
          ref={addButton}
          startIcon={<AddIcon />}
          variant="outlined"
        >
          {!isWizardless ? 'Add new wizard step' : 'Add new question'}
        </CustomisedOutlineButton>
        <CustomisedOutlineButton
          variant="outlined"
          title={'Expand / collapse all'}
          className={classes.expandButton}
          onClick={handleSectionsExpansion}
          disabled={isEmptyFormStructure}
        >
          {sectionsExpanded ? <ExpandLess /> : <ExpandMore />}
        </CustomisedOutlineButton>
        <CustomisedOutlineButton
          variant="outlined"
          title={'Validate form'}
          className={classes.spellCheckButton}
          onClick={handleValidateForm}
          disabled={isEmptyFormStructure}
        >
          <Spellcheck />
        </CustomisedOutlineButton>
        <CustomisedOutlineButton
          variant="outlined"
          title={'Edit in code'}
          className={classes.codeButton}
          onClick={switchToCodeEditor}
          disabled={isEmptyFormStructure}
        >
          <Code />
        </CustomisedOutlineButton>
        <ConfigModal />
      </div>
      <SidebarDroparea />
    </>
  );
};

export default SidebarNav;

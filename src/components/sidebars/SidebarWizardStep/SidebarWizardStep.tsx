import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import AddIcon from '@material-ui/icons/Add';
import React, { useContext, useRef } from 'react';
import { NEW_QUESTION, NEW_WIZARD_SECTION_QUESTION } from '../../../constants';
import { CustomiseQuestionContext, OnSaveQuestionsCallback } from '@contexts/CustomiseQuestionContext';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './SidebarWizardStep.styles';
import { enableNotDraggableAndDroppable, isSectionOrWizardStep } from '@utils/itemDragHelpers';
import { isBoolean } from 'lodash';

const SidebarWizardStep = ({}) => {
  const classes = useStyles();

  const addButton = useRef<HTMLButtonElement | null>(null);
  const unorderedDropArea = useRef<HTMLDivElement | null>(null);

  const { getClonedFormStructure, addNewNodes, formStructure, moveNodeUnderNode, isWizardless } = useContext(
    FormStructureContext
  );

  const { customiseQuestion } = useContext(CustomiseQuestionContext);

  const addNewTopLevelQuestion = () => {
    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.warn('Missing root', clonedFormStructure);
      return;
    }

    customiseQuestion({
      customisingQuestion: isWizardless === false ? { ...NEW_WIZARD_SECTION_QUESTION } : { ...NEW_QUESTION },
      onSave: (): OnSaveQuestionsCallback => (questions) => addNewNodes(questions, root, clonedFormStructure),
      onCancel: () => () => addButton.current?.classList.remove(classes.buttonHighlight),
      onInit: () => addButton.current?.classList.add(classes.buttonHighlight),
      isNewQuestion: true
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      e.preventDefault();

      (e.target as HTMLDivElement).style.opacity = '1';

      enableNotDraggableAndDroppable();

      unorderedDropArea.current!.classList.remove(classes.unorderedDropAreaHighlight);
      document.getElementById('question-drop-area')!.style.display = 'none';

      const movingNodeId = e.dataTransfer.types.slice(-1)[0];
      const targetNodeId = formStructure.getRoot().data['@id'];

      if (!targetNodeId || !movingNodeId) {
        console.warn('Missing targetNodeId or movingNodeId');
        return;
      }

      moveNodeUnderNode(movingNodeId, targetNodeId, true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);

      if (!isWizardless && !isSectionOrWizardStep(movingNode)) {
        return;
      }

      unorderedDropArea.current!.classList.add(classes.unorderedDropAreaHighlight);

      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      unorderedDropArea.current!.classList.remove(classes.unorderedDropAreaHighlight);
    }
  };

  return (
    <>
      {isBoolean(isWizardless) && (
        <CustomisedOutlineButton
          onClick={addNewTopLevelQuestion}
          title={isWizardless === false ? 'Add new wizard step' : 'Add new question'}
          ref={addButton}
          className={classes.addPageButton}
          startIcon={<AddIcon />}
          variant="outlined"
        >
          {!isWizardless ? 'Add new wizard step' : 'Add new question'}
        </CustomisedOutlineButton>
      )}
      <div
        data-droppable={true}
        id="question-drop-area"
        ref={unorderedDropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={classes.unorderedDropArea}
      >
        Drop here for unordered top level question
      </div>
    </>
  );
};

export default SidebarWizardStep;

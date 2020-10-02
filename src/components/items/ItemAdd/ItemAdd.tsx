import React, { FC, useContext, useRef } from 'react';
import useStyles from './ItemAdd.styles';
import AddIcon from '@material-ui/icons/Add';
import {
  detectIsChildNode,
  enableNotDraggableAndDroppable,
  highlightQuestion,
  isSectionOrWizardStep,
  moveQuestionToSpecificPosition,
  removeBeingPrecedingQuestion,
  removeFromSubquestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '@utils/index';
import { Constants } from 's-forms';
import { FormStructureContext } from '@contexts/FormStructureContext';
import FormStructureNode from '@model/FormStructureNode';
import { CustomiseQuestionContext, OnSaveCallback } from '@contexts/CustomiseQuestionContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import FormStructure from '@model/FormStructure';
import { NEW_QUESTION, NEW_WIZARD_SECTION_QUESTION } from '../../../constants';
import classNames from 'classnames';

type Props = {
  position: number;
  parentQuestionId: string;
  isWizardPosition?: boolean;
  topLevelPosition?: boolean;
};

const ItemAdd: FC<Props> = ({ parentQuestionId, position, isWizardPosition = false, topLevelPosition = false }) => {
  const classes = useStyles();
  const addContainer = useRef<HTMLDivElement | null>(null);

  const { formStructure, setFormStructure, getClonedFormStructure, isWizardless } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    addContainer.current?.classList.add('addItemHover');
  };

  const handleMouseLeave = () => {
    addContainer.current?.classList.remove('addItemHover');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.addItem)) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);
      const targetNode = formStructure.getNode(parentQuestionId);

      // if target element is child of moving element => no highlight
      if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
        return;
      }

      // if moving node is non-section element => no highlight on wizard adds
      if (isWizardPosition && !isSectionOrWizardStep(movingNode)) {
        return;
      }

      (e.target as HTMLDivElement).classList.add('addItemHover');

      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.addItem)) {
      (e.target as HTMLDivElement).classList.remove('addItemHover');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.addItem)) {
      e.preventDefault();

      enableNotDraggableAndDroppable();

      [].forEach.call(document.querySelectorAll('[data-droppable=true]'), (el: HTMLDivElement) => {
        el.classList.remove('addItemHover');
      });

      const movingNodeId = e.dataTransfer.types.slice(-1)[0];

      const movingNode = formStructure.getNode(movingNodeId);
      const targetNode = formStructure.getNode(parentQuestionId);

      if (!movingNode || !targetNode) {
        console.warn('Missing movingNode or targetNode', movingNode, targetNode);
        return;
      }

      // if target element is child of moving element => no moving allowed
      if (detectIsChildNode(movingNode, targetNode)) {
        console.warn("Cannot move item under it's child item!");
        return;
      }

      moveNodes(movingNodeId, parentQuestionId);
    }
  };

  const moveNodes = (movingNodeId: string, targetNodeId: string) => {
    const clonedFormStructure = getClonedFormStructure();

    const movingNode = clonedFormStructure.getNode(movingNodeId);
    const targetNode = clonedFormStructure.getNode(targetNodeId);
    const movingNodeParent = movingNode?.parent;

    if (!movingNode?.data || !targetNode?.data || !movingNodeParent) {
      console.warn(
        "Missing movingNode's data or parent, or targetNode's data",
        movingNode,
        targetNode,
        movingNodeParent
      );
      return;
    }

    if (isWizardPosition && !isSectionOrWizardStep(movingNode)) {
      console.warn('Cannot move non-wizard-step or non-section under the form node.');
      return;
    }

    const layoutClass = movingNode.data[Constants.LAYOUT_CLASS];

    if (isWizardPosition && !layoutClass.includes(Constants.LAYOUT.WIZARD_STEP)) {
      layoutClass.push(Constants.LAYOUT.WIZARD_STEP);
    } else if (isWizardPosition && layoutClass.includes(Constants.LAYOUT.WIZARD_STEP)) {
      layoutClass.splice(layoutClass.indexOf(Constants.LAYOUT.WIZARD_STEP), 1);
    }

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    const removedIndex = removeFromSubquestions(movingNodeParent, movingNode);

    // if moving node within one parent from top to down, position is decreased by one, because node is deleted 1 line before
    if (movingNodeParent.data['@id'] === targetNode.data['@id'] && removedIndex < position) {
      position--;
    }

    moveQuestionToSpecificPosition(position, targetNode, movingNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(movingNodeId);

    window.scrollBy(0, 40);
    document.getElementById('question-drop-area')!.style.display = 'none';
  };

  const handleAddNewQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();

    const clonedFormStructure = getClonedFormStructure();

    const targetNode = clonedFormStructure.getNode(parentQuestionId);

    if (!targetNode) {
      console.warn('Missing targetNode', targetNode);
      return;
    }

    customiseQuestion({
      customisingQuestion:
        isWizardless === false && isWizardPosition ? { ...NEW_WIZARD_SECTION_QUESTION } : { ...NEW_QUESTION },
      onSave: (): OnSaveCallback => (customisingQuestion) =>
        addNewQuestionToSpecificPosition(customisingQuestion, targetNode, clonedFormStructure),
      onCancel: () => () => addContainer.current?.classList.remove(classes.highlightAddLine),
      onInit: () => addContainer.current?.classList.add(classes.highlightAddLine),
      isNewQuestion: true
    });
  };

  const addNewQuestionToSpecificPosition = (
    newQuestion: FormStructureQuestion,
    targetNode: FormStructureNode,
    clonedFormStructure: FormStructure
  ): void => {
    addContainer.current?.classList.remove(classes.highlightAddLine);

    const node = new FormStructureNode(targetNode, newQuestion);

    clonedFormStructure.addNode(newQuestion['@id'], node);

    moveQuestionToSpecificPosition(position, targetNode, node);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(newQuestion['@id']);
  };

  return (
    <div
      className={classNames(classes.addItem, { [classes.marginTop]: topLevelPosition })}
      ref={addContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleAddNewQuestion}
      title={isWizardPosition ? 'Add new wizard step on certain position' : 'Add new question on certain position'}
      data-droppable={true}
    >
      <AddIcon fontSize={'large'} />
    </div>
  );
};

export default ItemAdd;

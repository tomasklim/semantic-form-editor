import React, { FC, useContext, useRef } from 'react';
import useStyles from './AddItem.styles';
import AddIcon from '@material-ui/icons/Add';
import {
  detectIsChildNode,
  highlightQuestion,
  moveQuestionToSpecificPosition,
  removeBeingPrecedingQuestion,
  removeFromSubQuestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '@utils/formBuilder';
import { Constants } from 's-forms';
import { FormStructureContext } from '@contexts/FormStructureContext';
import FormStructureNode from '@model/FormStructureNode';
import { enableNotDraggableAndDroppable } from '@utils/itemDragHelpers';
import { CustomiseItemContext, OnSaveCallback } from '@contexts/CustomiseItemContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import FormStructure from '@model/FormStructure';
import { NEW_ITEM } from '../../../constants';

type Props = {
  parentId: string;
  position: number;
};

const AddItem: FC<Props> = ({ parentId, position }) => {
  const classes = useStyles();
  const addContainer = useRef<HTMLDivElement | null>(null);

  const { formStructure, getClonedFormStructure, setFormStructure } = useContext(FormStructureContext);
  const { customiseItemData } = useContext(CustomiseItemContext);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    addContainer.current?.classList.add('addLineHover');
  };

  const handleMouseLeave = () => {
    addContainer.current?.classList.remove('addLineHover');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.addLine)) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);
      const targetNode = formStructure.getNode(parentId);

      // if target element is child of moving element => no highlight
      if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
        return;
      }

      (e.target as HTMLDivElement).classList.add('addLineHover');

      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.addLine)) {
      (e.target as HTMLDivElement).classList.remove('addLineHover');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.addLine)) {
      e.preventDefault();

      enableNotDraggableAndDroppable();

      [].forEach.call(document.querySelectorAll('[data-droppable=true]'), (el: HTMLDivElement) => {
        el.classList.remove('addLineHover');
      });

      const movingNodeId = e.dataTransfer.types.slice(-1)[0];
      e.dataTransfer.clearData();

      const movingNode = formStructure.getNode(movingNodeId);
      const targetNode = formStructure.getNode(parentId);

      if (!movingNode || !targetNode) {
        console.warn('Missing movingNode or targetNode');
        return;
      }

      // if target element is child of moving element => no moving allowed
      if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
        return;
      }

      moveNodes(movingNodeId, parentId);
    }
  };

  const moveNodes = (movingNodeId: string, targetNodeId: string) => {
    const clonedFormStructure = getClonedFormStructure();

    const movingNode = clonedFormStructure.getNode(movingNodeId);
    const targetNode = clonedFormStructure.getNode(targetNodeId);

    if (!movingNode?.data || !movingNode?.parent || !targetNode?.data) {
      console.error("Missing movingNode' questionData or parent, or targetNode's questionData");
      return;
    }

    const movingNodeParent = movingNode.parent;

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    const removedIndex = removeFromSubQuestions(movingNodeParent, movingNode);

    // if moving node within one parent from top to down, position is decreased by one, because node is deleted 1 line before
    if (movingNodeParent.data['@id'] === targetNode.data['@id'] && removedIndex < position) {
      position--;
    }

    moveQuestionToSpecificPosition(position, targetNode, movingNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(movingNodeId);

    window.scrollBy(0, 40);
  };

  const handleAddNewQuestion = () => {
    const clonedFormStructure = getClonedFormStructure();

    const targetNode = clonedFormStructure.getNode(parentId);

    if (!targetNode) {
      console.error('Missing targetNode');
      return;
    }

    customiseItemData(
      NEW_ITEM,
      (): OnSaveCallback => (itemData) => addNewQuestionToSpecificPosition(itemData, targetNode, clonedFormStructure),
      () => () => addContainer.current?.classList.remove(classes.highlightAddLine),
      () => addContainer.current?.classList.add(classes.highlightAddLine)
    );
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
      className={classes.addLine}
      ref={addContainer}
      data-droppable={true}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleAddNewQuestion}
    >
      <AddIcon fontSize={'large'} />
    </div>
  );
};

export default AddItem;

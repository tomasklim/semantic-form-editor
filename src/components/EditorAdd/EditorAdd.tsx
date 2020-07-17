import React, { Dispatch, FC, SetStateAction } from 'react';
import useStyles from './EditorAdd.styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Box } from '@material-ui/core';
import {
  detectIsChildNode,
  moveQuestionToSpecificPosition,
  removeBeingPrecedingQuestion,
  removeFromSubQuestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '../../utils/formBuilder';
import ETree from '../../model/ETree';
import { cloneDeep } from 'lodash';
import { Constants } from 's-forms';

type Props = {
  parentId: string;
  position: number;
  tree: ETree;
  setTree: Dispatch<SetStateAction<ETree | null>>;
};

const EditorAdd: FC<Props> = ({ parentId, position, tree, setTree }) => {
  const classes = useStyles();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).nodeName === 'DIV') {
      const movingNode = tree.getNode(e.dataTransfer.types.slice(-1)[0]);
      const targetNode = tree.getNode(parentId);

      // if target element is child of moving element => no highlight
      if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
        return;
      }

      (e.target as HTMLDivElement).classList.add(classes.overAdd);

      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).classList.remove(classes.overAdd);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    document
      .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
      .forEach((element) => ((element as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'all'));

    [].forEach.call(document.querySelectorAll('[data-droppable=true]'), (el: HTMLDivElement) => {
      el.classList.remove(classes.overAdd);
    });

    if ((e.target as HTMLDivElement).nodeName === 'DIV') {
      const movingNodeId = e.dataTransfer.types.slice(-1)[0];
      e.dataTransfer.clearData();

      const movingNode = tree.getNode(movingNodeId);
      const targetNode = tree.getNode(parentId);

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
    const newTree = cloneDeep(tree);

    const movingNode = newTree.getNode(movingNodeId);
    const targetNode = newTree.getNode(targetNodeId);

    if (!movingNode?.data || !movingNode?.parent || !targetNode?.data) {
      console.error("Missing movingNode' data or parent, or targetNode's data");
      return;
    }

    const movingNodeParent = movingNode.parent;

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    const removedIndex = removeFromSubQuestions(movingNodeParent, movingNode);

    // if moving node from top to down, position is decreased by one, because node is deleted 1 line before
    if (removedIndex < position) {
      position--;
    }

    moveQuestionToSpecificPosition(position, targetNode, movingNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setTree(newTree);
  };

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      className={classes.addLine}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-droppable={true}
    >
      <AddCircleIcon fontSize={'large'} />
    </Box>
  );
};

export default EditorAdd;

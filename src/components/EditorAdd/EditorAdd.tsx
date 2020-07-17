import React, { Dispatch, FC, SetStateAction } from 'react';
import useStyles from './EditorAdd.styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Box } from '@material-ui/core';
import { detectChild, sortRelatedQuestions } from '../../utils/formBuilder';
import ETree from '../../model/ETree';
import ENode, { ENodeData } from '../../model/ENode';
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

    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).nodeName === 'DIV') {
      const moving = tree?.structure.get(e.dataTransfer.types.slice(-1)[0]);
      const target = tree?.structure.get(parentId);

      if (moving && target && detectChild(moving, target)) {
        return;
      }

      (e.target as HTMLDivElement).classList.add(classes.over);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).classList.remove(classes.over);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    document
      .querySelectorAll('*:not([data-droppable=true])')
      .forEach((element) => (element.style.pointerEvents = 'all'));

    [].forEach.call(document.querySelectorAll('[data-droppable=true]'), (li: HTMLLIElement) => {
      li.classList.remove(classes.over);
    });

    if ((e.target as HTMLDivElement).getAttribute('data-parentid')) {
      const moving = tree?.structure.get(e.dataTransfer.types.slice(-1)[0]);
      const target = tree?.structure.get(parentId);

      if (moving && target && detectChild(moving, target)) {
        return;
      }

      move(moving, target);
      e.dataTransfer.clearData();
    }

    return false;
  };

  const move = (nodeToMove: ENode, nodeOfPlace: ENode) => {
    const newTree = cloneDeep(tree);

    nodeToMove = newTree.structure.get(nodeToMove.data['@id']);
    nodeOfPlace = newTree.structure.get(nodeOfPlace.data['@id']);

    if (!nodeToMove?.data || !nodeOfPlace?.data) {
      console.warn('Error3');
      return;
    }

    // if node with preceding question is moved, it loses its preceding question
    if (nodeToMove.data[Constants.HAS_PRECEDING_QUESTION]) {
      delete nodeToMove.data[Constants.HAS_PRECEDING_QUESTION];
    }

    if (!nodeToMove?.parent) {
      console.warn('Error');
      return;
    }

    const oldNodeParent = nodeToMove.parent;

    if (!oldNodeParent?.data || !nodeOfPlace?.data) {
      console.warn('Error1');
      return;
    }

    // if some node has nodeToMove as a preceding node, it loses it
    oldNodeParent.data[Constants.HAS_SUBQUESTION].forEach((nodeData: ENodeData) => {
      if (
        nodeData[Constants.HAS_PRECEDING_QUESTION] &&
        nodeData[Constants.HAS_PRECEDING_QUESTION]['@id'] === nodeToMove.data['@id']
      ) {
        delete nodeData[Constants.HAS_PRECEDING_QUESTION];
      }
    });

    if (!oldNodeParent || !nodeOfPlace) {
      console.warn('Error2');
      return;
    }

    oldNodeParent.data[Constants.HAS_SUBQUESTION] = oldNodeParent.data[Constants.HAS_SUBQUESTION].filter(
      (node: ENodeData) => node['@id'] !== nodeToMove.data['@id']
    );

    if (position !== nodeOfPlace.data[Constants.HAS_SUBQUESTION]?.length) {
      nodeOfPlace.data[Constants.HAS_SUBQUESTION][position][Constants.HAS_PRECEDING_QUESTION] = nodeToMove.data['@id'];
    }

    if (position !== 0) {
      nodeToMove.data[Constants.HAS_PRECEDING_QUESTION] = nodeOfPlace.data[Constants.HAS_SUBQUESTION][position - 1];
    }

    nodeOfPlace.data[Constants.HAS_SUBQUESTION].splice(position, 0, nodeToMove.data);

    nodeOfPlace.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(nodeOfPlace.data[Constants.HAS_SUBQUESTION]);

    setTree(newTree);
  };

  return (
    <Box
      className={classes.addLine}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      data-droppable={true}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AddCircleIcon fontSize={'large'} />
    </Box>
  );
};

export default EditorAdd;

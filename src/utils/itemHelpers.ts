import FormStructureNode from '@model/FormStructureNode';
import { Constants, Intl } from 's-forms';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import FormStructure from '@model/FormStructure';
import React from 'react';
import { CustomiseQuestion } from '@contexts/CustomiseQuestionContext';

export const detectIsChildNode = (testedNode: FormStructureNode, exemplarNode: FormStructureNode): boolean => {
  return testedNode.data['@id'] === exemplarNode.data['@id']
    ? true
    : exemplarNode.parent
    ? detectIsChildNode(testedNode, exemplarNode.parent)
    : false;
};

export const removePrecedingQuestion = (node: FormStructureNode): void => {
  if (node.data[Constants.HAS_PRECEDING_QUESTION]) {
    delete node.data[Constants.HAS_PRECEDING_QUESTION];
  }
};

export const removeBeingPrecedingQuestion = (
  movingNodeParent: FormStructureNode,
  movingNode: FormStructureNode
): void => {
  // if some node has nodeToMove as a preceding node, it loses it
  movingNodeParent.data[Constants.HAS_SUBQUESTION].forEach((question: FormStructureQuestion) => {
    if (
      question[Constants.HAS_PRECEDING_QUESTION] &&
      question[Constants.HAS_PRECEDING_QUESTION]['@id'] === movingNode.data['@id']
    ) {
      delete question[Constants.HAS_PRECEDING_QUESTION];
    }
  });
};

export const removeFromSubquestions = (movingNodeParent: FormStructureNode, movingNode: FormStructureNode): number => {
  let removedNodeIndex = -1;

  movingNodeParent.data[Constants.HAS_SUBQUESTION] = movingNodeParent.data[Constants.HAS_SUBQUESTION]?.filter(
    (node: FormStructureQuestion, index: number) => {
      if (node['@id'] === movingNode.data['@id']) {
        removedNodeIndex = index;
      }
      return node['@id'] !== movingNode.data['@id'];
    }
  );

  return removedNodeIndex;
};

export const removeFromFormStructure = (formStructure: FormStructure, node: FormStructureNode): void => {
  formStructure.removeNode(node.data['@id']);

  node.data[Constants.HAS_SUBQUESTION]?.forEach((q: FormStructureQuestion) => {
    removeFromFormStructure(formStructure, formStructure.getNode(q['@id'])!);
  });
};

export const moveQuestionToSpecificPosition = (
  position: number,
  targetNode: FormStructureNode,
  movingNode: FormStructureNode
): void => {
  movingNode.parent = targetNode;

  if (position !== targetNode.data[Constants.HAS_SUBQUESTION]?.length) {
    targetNode.data[Constants.HAS_SUBQUESTION]![position][Constants.HAS_PRECEDING_QUESTION] = {
      '@id': movingNode.data['@id']
    };
  }

  if (position !== 0) {
    movingNode.data[Constants.HAS_PRECEDING_QUESTION] = {
      '@id': targetNode.data[Constants.HAS_SUBQUESTION]![position - 1]['@id']
    };
  }

  targetNode.data[Constants.HAS_SUBQUESTION]!.splice(position, 0, movingNode.data);
  movingNode.parent = targetNode;
};

export const moveQuestion = (movingNode: FormStructureNode, targetNode: FormStructureNode): void => {
  if (!targetNode.data[Constants.HAS_SUBQUESTION]) {
    targetNode.data[Constants.HAS_SUBQUESTION] = [];
  }

  targetNode.data[Constants.HAS_SUBQUESTION]!.push(movingNode.data);
  movingNode.parent = targetNode;
};

export const highlightQuestion = (movingNodeId: string): void => {
  setTimeout(() => {
    document.getElementById(movingNodeId)?.classList.add('highlightQuestion');

    document.querySelector('.itemHover')?.classList.remove('itemHover');
    document.querySelector('.itemHover')?.classList.remove('addItemHover');
  }, 200);

  setTimeout(() => {
    document.getElementById(movingNodeId)?.classList.remove('highlightQuestion');
  }, 3000);
};

export const getUniqueId = (label: string, formStructure: FormStructure): string => {
  if (!label) {
    label = 'id';
  }

  let id;
  do {
    id = `${label}-${Math.floor(Math.random() * 10000)}`
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
      .map((x: string) => x.toLowerCase())
      .join('-');
  } while (formStructure.getNode(id));

  return id;
};

export const createFakeChangeEvent = (name: string, value: any): any => {
  return {
    target: {
      name,
      value
    }
  };
};

export const onItemClickHandler = (
  e: React.MouseEvent,
  customiseQuestion: CustomiseQuestion,
  question: FormStructureQuestion,
  updateNode: Function,
  itemContainer: React.MutableRefObject<HTMLLIElement | null>,
  highlightClass: string,
  intl: Intl
) => {
  e.stopPropagation();

  customiseQuestion({
    customisingQuestion: question,
    onSave: () => (customisingQuestion: FormStructureQuestion) => {
      updateNode(customisingQuestion, intl);
      highlightQuestion(customisingQuestion['@id']);
    },
    onInit: () => itemContainer.current?.classList.add(highlightClass),
    onCancel: () => () => itemContainer.current?.classList.remove(highlightClass)
  });
};

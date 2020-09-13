import FormStructureNode from '@model/FormStructureNode';
import { Constants } from 's-forms';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import FormStructure from '@model/FormStructure';

export const detectIsChildNode = (testedNode: FormStructureNode, exemplarNode: FormStructureNode): boolean => {
  if (!exemplarNode.parent) {
    return false;
  }

  return testedNode.data['@id'] === exemplarNode.data['@id']
    ? true
    : detectIsChildNode(testedNode, exemplarNode.parent);
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
  movingNodeParent.data[Constants.HAS_SUBQUESTION]?.forEach((nodeData: FormStructureQuestion) => {
    if (
      nodeData[Constants.HAS_PRECEDING_QUESTION] &&
      nodeData[Constants.HAS_PRECEDING_QUESTION]!['@id'] === movingNode.data['@id']
    ) {
      delete nodeData[Constants.HAS_PRECEDING_QUESTION];
    }
  });
};

export const removeFromSubQuestions = (movingNodeParent: FormStructureNode, movingNode: FormStructureNode): number => {
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

  node.data[Constants.HAS_SUBQUESTION]?.forEach((q) => {
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

export const moveQuestion = (movingNode: FormStructureNode, destinationNode: FormStructureNode): void => {
  if (!destinationNode.data[Constants.HAS_SUBQUESTION]) {
    destinationNode.data[Constants.HAS_SUBQUESTION] = [];
  }

  destinationNode.data[Constants.HAS_SUBQUESTION]!.push(movingNode.data);
  movingNode.parent = destinationNode;
};

export const highlightQuestion = (movingNodeId: string): void => {
  document.getElementById(movingNodeId)?.classList.add('highlightQuestion');

  setTimeout(() => {
    document.getElementById(movingNodeId)?.classList.add('highlightQuestion');

    document.querySelector('.listItemHover')?.classList.remove('listItemHover');
    document.querySelector('.listItemHover')?.classList.remove('addLineHover');
  }, 100);

  setTimeout(() => {
    document.getElementById(movingNodeId)?.classList.remove('highlightQuestion');
  }, 3000);
};

export const getId = (title: string): string => {
  if (!title) {
    return '';
  }

  title = `${title}-${Math.floor(Math.random() * 10000)}`;

  return title
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
    .map((x: string) => x.toLowerCase())
    .join('-');
};

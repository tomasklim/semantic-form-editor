import { Constants, FormUtils, JsonLdFramingUtils, JsonLdObjectMap, JsonLdObjectUtils } from 's-forms';
import * as jsonld from 'jsonld';
import ETree from '../model/ETree';
import ENode, { ENodeData } from '../model/ENode';
import { EForm } from '../interfaces';

let mapping: Map<string, number> = new Map<string, number>();
let formElements: EForm;

export const buildFormStructure = async (form: EForm) => {
  unifyFormStructure(form);

  // @ts-ignore
  formElements = await jsonld.flatten(form, {});

  const id2ObjectMap = JsonLdFramingUtils.modifyStructure(formElements);

  Object.keys(id2ObjectMap).map((key) => {
    JsonLdObjectMap.putObject(key, id2ObjectMap[key]);
  });

  formElements['@graph'].forEach((item: ENodeData, index: number) => {
    mapping.set(item['@id'], index);
  });

  const rootData = findFormRoot();
  const rootNode = new ENode(null, rootData);

  const tree = new ETree(rootNode);
  tree.addNode(rootNode.data['@id'], rootNode);

  preOrderBuild(rootNode, tree);

  return tree;
};

const findFormRoot = () => {
  return formElements['@graph'].find((item: ENodeData) => FormUtils.isForm(item));
};

const preOrderBuild = (parentNode: ENode, tree: ETree) => {
  let relatedQuestions = parentNode.data[Constants.HAS_SUBQUESTION];
  if (relatedQuestions) {
    relatedQuestions = sortRelatedQuestions(relatedQuestions);

    relatedQuestions.forEach((question: ENodeData) => {
      const node = new ENode(parentNode, question);

      tree.addNode(question['@id'], node);

      preOrderBuild(node, tree);
    });
  }

  return;
};

export const sortRelatedQuestions = (relatedQuestions: Array<ENodeData> | undefined): Array<ENodeData> => {
  if (!relatedQuestions) {
    return [];
  }

  // sort by label
  const localizedRelatedQuestions = JsonLdObjectUtils.orderByLocalizedLabels(relatedQuestions, {
    locale: 'en'
  });

  // sort by property
  const topologicalSortedRelatedQuestions = JsonLdObjectUtils.orderPreservingToplogicalSort(
    localizedRelatedQuestions,
    Constants.HAS_PRECEDING_QUESTION
  );

  return topologicalSortedRelatedQuestions;
};

const unifyFormStructure = (form: EForm): EForm => {
  form['@graph'].forEach((node) => {
    if (node[Constants.HAS_SUBQUESTION] && !Array.isArray(node[Constants.HAS_SUBQUESTION])) {
      // @ts-ignore
      node[Constants.HAS_SUBQUESTION] = transformSubQuestionsToArray(node[Constants.HAS_SUBQUESTION]);
    }

    if (node[Constants.HAS_LAYOUT_CLASS] && !Array.isArray(node[Constants.HAS_LAYOUT_CLASS])) {
      // @ts-ignore
      node[Constants.HAS_LAYOUT_CLASS] = transformHasLayoutClassToArray(node[Constants.HAS_LAYOUT_CLASS]);
    }
  });

  return form;
};

const transformSubQuestionsToArray = (element: ENodeData): Array<ENodeData> => {
  return [element];
};

const transformHasLayoutClassToArray = (element: string): Array<string> => {
  return [element];
};

export const detectIsChildNode = (testedNode: ENode, exemplarNode: ENode): boolean => {
  if (!exemplarNode.parent) {
    return false;
  }

  return testedNode.data['@id'] === exemplarNode.data['@id']
    ? true
    : detectIsChildNode(testedNode, exemplarNode.parent);
};

export const removePrecedingQuestion = (node: ENode) => {
  if (node.data[Constants.HAS_PRECEDING_QUESTION]) {
    delete node.data[Constants.HAS_PRECEDING_QUESTION];
  }
};

export const removeBeingPrecedingQuestion = (movingNodeParent: ENode, movingNode: ENode) => {
  // if some node has nodeToMove as a preceding node, it loses it
  movingNodeParent.data[Constants.HAS_SUBQUESTION]?.forEach((nodeData: ENodeData) => {
    if (
      nodeData[Constants.HAS_PRECEDING_QUESTION] &&
      nodeData[Constants.HAS_PRECEDING_QUESTION]['@id'] === movingNode.data['@id']
    ) {
      delete nodeData[Constants.HAS_PRECEDING_QUESTION];
    }
  });
};

export const removeFromSubQuestions = (movingNodeParent: ENode, movingNode: ENode): number => {
  let removedNodeIndex = -1;

  movingNodeParent.data[Constants.HAS_SUBQUESTION] = movingNodeParent.data[Constants.HAS_SUBQUESTION]?.filter(
    (node: ENodeData, index: number) => {
      if (node['@id'] === movingNode.data['@id']) {
        removedNodeIndex = index;
      }
      return node['@id'] !== movingNode.data['@id'];
    }
  );

  return removedNodeIndex;
};

export const moveQuestionToSpecificPosition = (position: number, targetNode: ENode, movingNode: ENode) => {
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

export const moveQuestion = (movingNode: ENode, destinationNode: ENode) => {
  if (!destinationNode.data[Constants.HAS_SUBQUESTION]) {
    destinationNode.data[Constants.HAS_SUBQUESTION] = [];
  }

  destinationNode.data[Constants.HAS_SUBQUESTION]!.push(movingNode.data);
  movingNode.parent = destinationNode;
};

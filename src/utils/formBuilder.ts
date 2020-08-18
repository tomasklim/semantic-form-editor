import { Constants, FormUtils, JsonLdFramingUtils, JsonLdObjectMap, JsonLdObjectUtils } from 's-forms';
import * as jsonld from 'jsonld';
import FormStructure from '../model/FormStructure';
import FormStructureNode from '../model/FormStructureNode';
import { EForm } from '../interfaces';
import { FormStructureQuestion } from '../model/FormStructureQuestion';

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

  formElements['@graph'].forEach((item: FormStructureQuestion, index: number) => {
    mapping.set(item['@id'], index);
  });

  const rootData = findFormRoot();
  const rootNode = new FormStructureNode(null, rootData);

  const tree = new FormStructure(rootNode);
  tree.addNode(rootNode.data['@id'], rootNode);

  preOrderBuild(rootNode, tree);

  return tree;
};

const findFormRoot = () => {
  return formElements['@graph'].find((item: FormStructureQuestion) => FormUtils.isForm(item));
};

const preOrderBuild = (parentNode: FormStructureNode, tree: FormStructure) => {
  let relatedQuestions = parentNode.data[Constants.HAS_SUBQUESTION];
  if (relatedQuestions) {
    relatedQuestions = sortRelatedQuestions(relatedQuestions);

    relatedQuestions.forEach((question: FormStructureQuestion) => {
      const node = new FormStructureNode(parentNode, question);

      tree.addNode(question['@id'], node);

      preOrderBuild(node, tree);
    });
  }

  return;
};

export const sortRelatedQuestions = (
  relatedQuestions: Array<FormStructureQuestion> | undefined
): Array<FormStructureQuestion> => {
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

const transformSubQuestionsToArray = (element: FormStructureQuestion): Array<FormStructureQuestion> => {
  return [element];
};

const transformHasLayoutClassToArray = (element: string): Array<string> => {
  return [element];
};

export const detectIsChildNode = (testedNode: FormStructureNode, exemplarNode: FormStructureNode): boolean => {
  if (!exemplarNode.parent) {
    return false;
  }

  return testedNode.data['@id'] === exemplarNode.data['@id']
    ? true
    : detectIsChildNode(testedNode, exemplarNode.parent);
};

export const removePrecedingQuestion = (node: FormStructureNode) => {
  if (node.data[Constants.HAS_PRECEDING_QUESTION]) {
    delete node.data[Constants.HAS_PRECEDING_QUESTION];
  }
};

export const removeBeingPrecedingQuestion = (movingNodeParent: FormStructureNode, movingNode: FormStructureNode) => {
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

export const removeFromFormStructure = (formStructure: FormStructure, node: FormStructureNode) => {
  formStructure.removeNode(node.data['@id']);

  node.data[Constants.HAS_SUBQUESTION]?.forEach((q) => {
    removeFromFormStructure(formStructure, formStructure.getNode(q['@id'])!);
  });
};

export const moveQuestionToSpecificPosition = (
  position: number,
  targetNode: FormStructureNode,
  movingNode: FormStructureNode
) => {
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

export const moveQuestion = (movingNode: FormStructureNode, destinationNode: FormStructureNode) => {
  if (!destinationNode.data[Constants.HAS_SUBQUESTION]) {
    destinationNode.data[Constants.HAS_SUBQUESTION] = [];
  }

  destinationNode.data[Constants.HAS_SUBQUESTION]!.push(movingNode.data);
  movingNode.parent = destinationNode;
};

export const highlightQuestion = (movingNodeId: string) => {
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

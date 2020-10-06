import FormStructureNode from '@model/FormStructureNode';
import { Constants, FormUtils } from 's-forms';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import FormStructure from '@model/FormStructure';
import React from 'react';
import { CustomiseQuestion } from '@contexts/CustomiseQuestionContext';
import { IIntl } from '@interfaces/index';
import { TEXT_FIELD } from '@constants/index';

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
  movingNodeParent.data[Constants.HAS_SUBQUESTION]?.forEach((question: FormStructureQuestion) => {
    if (
      question[Constants.HAS_PRECEDING_QUESTION] &&
      question[Constants.HAS_PRECEDING_QUESTION]!['@id'] === movingNode.data['@id']
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

export const moveQuestion = (movingNode: FormStructureNode, targetNode: FormStructureNode): void => {
  if (!targetNode.data[Constants.HAS_SUBQUESTION]) {
    targetNode.data[Constants.HAS_SUBQUESTION] = [];
  }

  targetNode.data[Constants.HAS_SUBQUESTION]!.push(movingNode.data);
  movingNode.parent = targetNode;
};

export const highlightQuestion = (movingNodeId: string): void => {
  document.getElementById(movingNodeId)?.classList.add('highlightQuestion');

  setTimeout(() => {
    document.getElementById(movingNodeId)?.classList.add('highlightQuestion');

    document.querySelector('.itemHover')?.classList.remove('itemHover');
    document.querySelector('.itemHover')?.classList.remove('addItemHover');
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
  intl: IIntl
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

// no section, no wizard-step
const layoutTypeFields = [
  TEXT_FIELD,
  Constants.LAYOUT.QUESTION_TYPEAHEAD,
  Constants.LAYOUT.TEXTAREA,
  Constants.LAYOUT.DATE,
  Constants.LAYOUT.TIME,
  Constants.LAYOUT.DATETIME,
  Constants.LAYOUT.MASKED_INPUT,
  Constants.LAYOUT.CHECKBOX
];

export const findLayoutTypeOfQuestion = (
  question: FormStructureQuestion,
  isEmptyFormStructure: boolean,
  isWizardless: boolean,
  isNewQuestion: boolean
) => {
  let layoutClasses = question[Constants.LAYOUT_CLASS];

  if (isEmptyFormStructure && !isWizardless) {
    question![Constants.LAYOUT_CLASS] = [Constants.LAYOUT.WIZARD_STEP, Constants.LAYOUT.QUESTION_SECTION];
    return Constants.LAYOUT.WIZARD_STEP;
  } else if (isEmptyFormStructure && isWizardless && FormUtils.isWizardStep(question)) {
    question![Constants.LAYOUT_CLASS] = [];
    return '';
  }

  if (isNewQuestion && layoutClasses && !layoutClasses.length) {
    return '';
  }

  if (!layoutClasses || !layoutClasses.length) {
    return TEXT_FIELD;
  }

  if (FormUtils.isWizardStep(question)) {
    return Constants.LAYOUT.WIZARD_STEP;
  }

  if (layoutClasses.length === 1 && layoutClasses[0] === Constants.LAYOUT.QUESTION_SECTION) {
    return Constants.LAYOUT.QUESTION_SECTION;
  }

  const layoutType = layoutClasses.filter((layoutClass) => layoutTypeFields.includes(layoutClass));

  if (!layoutType.length && FormUtils.isSection(question)) {
    return Constants.LAYOUT.QUESTION_SECTION;
  }

  if (!layoutType.length) {
    console.warn(`Question with id: ${question?.['@id']} does not have any defined layout type!`);
    return TEXT_FIELD;
  }

  return layoutType[0];
};

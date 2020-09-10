import { Constants, FormUtils, JsonLdFramingUtils, JsonLdObjectUtils } from 's-forms';
import * as jsonld from 'jsonld';
import FormStructure from '@model/FormStructure';
import FormStructureNode from '@model/FormStructureNode';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { Context, JsonLdObj } from 'jsonld/jsonld-spec';
import { ExpandedForm } from '@model/ExpandedForm';

export const buildFormStructure = async (form: ExpandedForm) => {
  unifyFormStructure(form);

  const flattenedForm: JsonLdObj = await jsonld.flatten(form, {});

  const expandedFormStructure = JsonLdFramingUtils.expandStructure(flattenedForm) as Array<FormStructureQuestion>;

  const rootData = findFormRoot(expandedFormStructure);
  const rootNode = new FormStructureNode(null, rootData);

  const formStructure = new FormStructure(rootNode);
  formStructure.addNode(rootNode.data['@id'], rootNode);

  preOrderBuild(rootNode, formStructure);

  return formStructure;
};

export const exportForm = async (formStructure: FormStructure, formContext: Context) => {
  const rootData = formStructure.root.data;

  const compressedStructure = JsonLdFramingUtils.compressStructure(rootData) as Array<FormStructureQuestion>;

  const exportedForm = await jsonld.compact(compressedStructure, formContext);

  return exportedForm;
};

const findFormRoot = (structure: Array<FormStructureQuestion>): FormStructureQuestion | undefined => {
  return Object.values(structure).find((item: FormStructureQuestion) => FormUtils.isForm(item));
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

const unifyFormStructure = (form: ExpandedForm): ExpandedForm => {
  form['@graph'].forEach((node) => {
    if (node[Constants.HAS_SUBQUESTION] && !Array.isArray(node[Constants.HAS_SUBQUESTION])) {
      // @ts-ignore
      node[Constants.HAS_SUBQUESTION] = transformSubQuestionsToArray(node[Constants.HAS_SUBQUESTION]);
    }

    if (node[Constants.LAYOUT_CLASS] && !Array.isArray(node[Constants.LAYOUT_CLASS])) {
      // @ts-ignore
      node[Constants.LAYOUT_CLASS] = transformHasLayoutClassToArray(node[Constants.LAYOUT_CLASS]);
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

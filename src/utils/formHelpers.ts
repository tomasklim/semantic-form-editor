import { Constants, FormUtils, JsonLdFramingUtils, JsonLdObjectUtils } from 's-forms';
import * as jsonld from 'jsonld';
import FormStructure from '@model/FormStructure';
import FormStructureNode from '@model/FormStructureNode';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { Context, JsonLdObj } from 'jsonld/jsonld-spec';
import { ExpandedForm } from '@model/ExpandedForm';
import { isObject } from 'lodash';
import { IIntl } from '@interfaces/index';

export const buildFormStructure = async (form: ExpandedForm) => {
  const flattenedForm: JsonLdObj = await jsonld.flatten(form, {});

  // @ts-ignore
  unifyFormStructure(flattenedForm);

  const expandedFormStructure = JsonLdFramingUtils.expandStructure(flattenedForm) as Array<FormStructureQuestion>;

  const rootData = findFormRoot(expandedFormStructure);
  const rootNode = new FormStructureNode(null, rootData);

  const formStructure = new FormStructure(rootNode);
  formStructure.addNode(rootNode.data['@id'], rootNode);

  const languages = findFormLanguages(formStructure);

  buildFormStructureResursion(rootNode, formStructure, getIntl(languages[0]));

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

export const findFormLanguages = (formStructure: FormStructure): Array<string> => {
  if (formStructure?.root?.data && formStructure.root.data[Constants.HAS_SUBQUESTION]) {
    const rootSubquestions = formStructure.root.data[Constants.HAS_SUBQUESTION];
    const languagesSet = new Set<string>();

    // @ts-ignore
    for (const [index, question] of rootSubquestions.entries()) {
      // check first five root questions to find languages of the form
      if (index === 5) break;

      const label = question[Constants.RDFS_LABEL];

      if (Array.isArray(label)) {
        label.forEach((localisedLabel) => {
          languagesSet.add(localisedLabel['@language']);
        });
      }
    }

    return Array.from(languagesSet);
  }
  return [];
};

export const buildFormStructureResursion = (parentNode: FormStructureNode, tree: FormStructure, intl: IIntl) => {
  let subquestions = parentNode.data[Constants.HAS_SUBQUESTION];
  if (subquestions) {
    subquestions = sortRelatedQuestions(subquestions, intl);

    subquestions.forEach((question: FormStructureQuestion) => {
      const node = new FormStructureNode(parentNode, question);

      tree.addNode(question['@id'], node);

      buildFormStructureResursion(node, tree, intl);
    });
  }

  return;
};

export const sortRelatedQuestions = (
  subquestions: Array<FormStructureQuestion> | undefined,
  intl: IIntl
): Array<FormStructureQuestion> => {
  if (!subquestions) {
    return [];
  }

  // sort by label
  const localizedRelatedQuestions = JsonLdObjectUtils.orderByLocalizedLabels(subquestions, intl);

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
      node[Constants.HAS_SUBQUESTION] = transformSubquestionsToArray(node[Constants.HAS_SUBQUESTION]);
    }

    if (node[Constants.LAYOUT_CLASS] && !Array.isArray(node[Constants.LAYOUT_CLASS])) {
      // @ts-ignore
      node[Constants.LAYOUT_CLASS] = transformHasLayoutClassToArray(node[Constants.LAYOUT_CLASS]);
    }

    if (
      node[Constants.RDFS_LABEL] &&
      isObject(node[Constants.RDFS_LABEL]) &&
      !Array.isArray(node[Constants.RDFS_LABEL])
    ) {
      // @ts-ignore
      node[Constants.RDFS_LABEL] = [node[Constants.RDFS_LABEL]];
    }

    if (
      node[Constants.HELP_DESCRIPTION] &&
      isObject(node[Constants.HELP_DESCRIPTION]) &&
      !Array.isArray(node[Constants.HELP_DESCRIPTION])
    ) {
      // @ts-ignore
      node[Constants.HELP_DESCRIPTION] = [node[Constants.HELP_DESCRIPTION]];
    }
  });

  return form;
};

const transformSubquestionsToArray = (element: FormStructureQuestion): Array<FormStructureQuestion> => {
  return [element];
};

const transformHasLayoutClassToArray = (element: string): Array<string> => {
  return [element];
};

export const getJsonAttValue = (question: FormStructureQuestion, attribute: string | symbol, by?: string) => {
  if (!question) {
    return null;
  }

  // @ts-ignore
  const att = question[attribute];

  if (!att) {
    return null;
  }

  if (typeof att === 'string') {
    return att;
  }

  if (by && att[by]) {
    return att[by];
  }

  if (att['@value']) {
    return att['@value'];
  }

  return null;
};

export const createJsonAttValue = (value: string | boolean, dataType: string): object => {
  return {
    '@type': dataType,
    '@value': value
  };
};

export const createJsonAttIdValue = (id: string): object => {
  return {
    '@id': id
  };
};

export const getIntl = (lang: string): IIntl => {
  if (!lang) {
    return {};
  }
  return {
    locale: lang
  };
};

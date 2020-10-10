import { Constants, FormUtils, Intl, JsonLdFramingUtils, JsonLdObjectUtils } from 's-forms';
import * as jsonld from 'jsonld';
import FormStructure from '@model/FormStructure';
import FormStructureNode from '@model/FormStructureNode';
import { FormStructureQuestion, LanguageObject } from '@model/FormStructureQuestion';
import { Context, JsonLdObj } from 'jsonld/jsonld-spec';
import { ExpandedForm } from '@model/ExpandedForm';
import { isObject } from 'lodash';
import { NEW_WIZARD_SECTION_QUESTION } from '@constants/index';
import { getUniqueId } from '@utils/itemHelpers';

export const buildFormStructure = async (form: ExpandedForm) => {
  const flattenedForm: JsonLdObj = await jsonld.flatten(form, {});

  // @ts-ignore
  unifyFormStructure(flattenedForm);

  const expandedFormStructure = JsonLdFramingUtils.expandStructure(flattenedForm) as Array<FormStructureQuestion>;

  const rootData = findFormRoot(expandedFormStructure);
  const rootNode = new FormStructureNode(null, rootData);

  const formStructure = new FormStructure(rootNode);
  formStructure.addNode(rootNode);

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

export const buildFormStructureResursion = (parentNode: FormStructureNode, tree: FormStructure, intl: Intl) => {
  let subquestions = parentNode.data[Constants.HAS_SUBQUESTION];
  if (subquestions) {
    subquestions = sortRelatedQuestions(subquestions, intl);

    subquestions.forEach((question: FormStructureQuestion) => {
      const node = new FormStructureNode(parentNode, question);

      tree.addNode(node);

      buildFormStructureResursion(node, tree, intl);
    });
  }

  return;
};

export const sortRelatedQuestions = (
  subquestions: Array<FormStructureQuestion> | undefined,
  intl: Intl
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
      node[Constants.HAS_SUBQUESTION] = transformToArray(node[Constants.HAS_SUBQUESTION]);
    }

    if (node[Constants.LAYOUT_CLASS] && !Array.isArray(node[Constants.LAYOUT_CLASS])) {
      node[Constants.LAYOUT_CLASS] = transformToArray(node[Constants.LAYOUT_CLASS]);
    }

    if (
      node[Constants.RDFS_LABEL] &&
      isObject(node[Constants.RDFS_LABEL]) &&
      !Array.isArray(node[Constants.RDFS_LABEL])
    ) {
      node[Constants.RDFS_LABEL] = transformToArray(node[Constants.RDFS_LABEL]);
    }

    if (
      node[Constants.HELP_DESCRIPTION] &&
      isObject(node[Constants.HELP_DESCRIPTION]) &&
      !Array.isArray(node[Constants.HELP_DESCRIPTION])
    ) {
      node[Constants.HELP_DESCRIPTION] = transformToArray(node[Constants.HELP_DESCRIPTION]);
    }
  });

  return form;
};

const transformToArray = (element: any): Array<any> => {
  return [element];
};

export const getJsonAttValue = (question: FormStructureQuestion, attribute: string, by?: string) => {
  if (!question) {
    return null;
  }

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

export const createJsonLanguageValue = (lang: string, value: string): LanguageObject => {
  return {
    '@language': lang,
    '@value': value
  };
};

export const getIntl = (lang: string): Intl => {
  if (!lang) {
    return {};
  }
  return {
    locale: lang
  };
};

export const transformToSimpleForm = (formStructure: FormStructure) => {
  const rootSubquestions = formStructure.getRoot().data[Constants.HAS_SUBQUESTION];

  rootSubquestions?.forEach((subquestion: FormStructureQuestion) => {
    subquestion[Constants.LAYOUT_CLASS] = subquestion[Constants.LAYOUT_CLASS].filter(
      (layout: string) => layout !== Constants.LAYOUT.WIZARD_STEP
    );
  });
};

export const transformToWizardForm = (formStructure: FormStructure) => {
  const rootData = formStructure.getRoot().data;

  const allRootSubquestionsAreSections = rootData[Constants.HAS_SUBQUESTION].every((question: FormStructureQuestion) =>
    FormUtils.isSection(question)
  );

  if (allRootSubquestionsAreSections) {
    rootData[Constants.HAS_SUBQUESTION].forEach((subquestion: FormStructureQuestion) => {
      subquestion[Constants.LAYOUT_CLASS] = [Constants.LAYOUT.WIZARD_STEP, ...subquestion[Constants.LAYOUT_CLASS]];
    });
  } else {
    const id = getUniqueId('wizard-step', formStructure);

    const newWizardStep = {
      ...NEW_WIZARD_SECTION_QUESTION,
      '@id': id,
      [Constants.HAS_SUBQUESTION]: rootData[Constants.HAS_SUBQUESTION]
    };

    const newNode = new FormStructureNode(formStructure.getRoot(), newWizardStep);

    newWizardStep[Constants.HAS_SUBQUESTION]?.forEach((subquestion: FormStructureQuestion) => {
      const subquestionNode = formStructure.getNode(subquestion['@id']);
      if (subquestionNode) {
        subquestionNode.parent = newNode;
      }
    });

    rootData[Constants.HAS_SUBQUESTION] = [newWizardStep];

    formStructure.addNode(newNode);
  }
};

export const editLocalisedLabel = (lang: string, value: string, questionAttribute: any) => {
  const availableLanguage =
    Array.isArray(questionAttribute) &&
    questionAttribute.find((language: LanguageObject) => language['@language'] === lang);

  // field already have value in this language
  if (availableLanguage) {
    availableLanguage['@value'] = value;
  } else {
    // language have to be added
    if (!Array.isArray(questionAttribute)) {
      questionAttribute = [];
    }

    const languageObject = createJsonLanguageValue(lang!, value);

    questionAttribute.push(languageObject);
  }
};

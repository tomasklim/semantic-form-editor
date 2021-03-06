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

export const buildFormStructure = async (form: ExpandedForm): Promise<FormStructure> => {
  const flattenedForm: JsonLdObj = await jsonld.flatten(form, {});

  // @ts-ignore
  unifyFormStructure(flattenedForm);

  const expandedFormStructure = JsonLdFramingUtils.expandStructure(flattenedForm) as Array<FormStructureQuestion>;

  const rootData = findFormRoot(expandedFormStructure);
  const rootNode = new FormStructureNode(null, rootData);

  const formStructure = new FormStructure(rootNode);

  const languages = findFormLanguages(formStructure);

  buildFormStructureResursion(rootNode, formStructure, getIntl(languages[0]));

  return formStructure;
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
    const rootData = formStructure.root.data;
    const languagesSet = new Set<string>();

    const findLanguagesRecursion = (question: FormStructureQuestion) => {
      const subquestions = question[Constants.HAS_SUBQUESTION];
      if (!subquestions || !subquestions.length) return;

      question[Constants.HAS_SUBQUESTION].forEach((question: FormStructureQuestion) => {
        const label = question[Constants.RDFS_LABEL];

        if (Array.isArray(label)) {
          label.forEach((localisedLabel) => {
            languagesSet.add(localisedLabel['@language']);
          });
        }

        findLanguagesRecursion(question);
      });
    };

    findLanguagesRecursion(rootData);

    return Array.from(languagesSet);
  }
  return [];
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

export const createJsonLocalisedValue = (lang: string, value: string): LanguageObject => {
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
      [Constants.RDFS_LABEL]: 'Temporary name',
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

export const editLocalisedLabel = (lang: string, value: string, question: any, attribute: string) => {
  const availableLanguage =
    Array.isArray(question[attribute]) &&
    question[attribute].find((language: LanguageObject) => language['@language'] === lang);

  // field already have value in this language
  if (availableLanguage) {
    availableLanguage['@value'] = value;
  } else {
    // language have to be added
    if (!Array.isArray(question[attribute])) {
      question[attribute] = [];
    }

    const languageObject = createJsonLocalisedValue(lang!, value);

    question[attribute].push(languageObject);
  }
};

import { JsonLdObjectUtils, Constants, FormUtils, JsonLdFramingUtils, JsonLdObjectMap } from 's-forms';
import * as jsonld from 'jsonld';
import ETree from '../model/ETree';
import ENode, { ENodeData } from '../model/ENode';
import { EForm } from '../interfaces';
import { Document } from 'jsonld/jsonld-spec';

let mapping: Map<string, number> = new Map<string, number>();
let formElements: EForm;

export const buildFormStructure = async (form: Document) => {
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
    if (!Array.isArray(relatedQuestions)) {
      parentNode.data[Constants.HAS_SUBQUESTION] = [relatedQuestions];
      relatedQuestions = parentNode.data[Constants.HAS_SUBQUESTION];
    }

    relatedQuestions = sortRelatedQuestions(relatedQuestions);

    relatedQuestions.forEach((question: ENodeData) => {
      const node = new ENode(parentNode, question);

      tree.addNode(question['@id'], node);

      preOrderBuild(node, tree);
    });
  }

  return;
};

export const sortRelatedQuestions = (relatedQuestions: Array<ENodeData>): Array<ENodeData> => {
  // sort by label
  relatedQuestions = JsonLdObjectUtils.orderByLocalizedLabels(relatedQuestions, {
    locale: 'en'
  });

  // sort by property
  relatedQuestions = JsonLdObjectUtils.orderPreservingToplogicalSort(
    relatedQuestions,
    Constants.HAS_PRECEDING_QUESTION
  );

  return relatedQuestions;
};

import ETree from '../model/ETree';
import ENode, { ENodeData } from '../model/ENode';

let mapping: Map<string, number>;
let formElements: Array<ENodeData>;

export const buildTree = () => {
  const form = require('./form.json');

  formElements = form['@graph'];
  mapping = new Map<string, number>();

  formElements.forEach((el, index) => {
    mapping.set(el['@id'], index);
  });

  const rootData = formElements.find((item) => item['has-layout-class'] === 'form');
  const rootNode = new ENode(null, rootData);

  const tree = new ETree(rootNode);
  tree.addNode(rootNode.data['@id'], rootNode);

  preOrderBuild(rootNode, tree);

  return tree;
};

const preOrderBuild = (parentNode: ENode, tree: ETree) => {
  let relatedQuestions = parentNode.data['has_related_question'];
  if (relatedQuestions) {
    if (!Array.isArray(relatedQuestions)) {
      parentNode.data.has_related_question = [relatedQuestions];
      relatedQuestions = parentNode.data['has_related_question'];
    }
    relatedQuestions.forEach((nodeId) => {
      const nodeIndex = mapping.get(nodeId);
      // @ts-ignore
      const nodeData = formElements[nodeIndex];

      const node = new ENode(parentNode.data['@id'], nodeData);

      tree.addNode(nodeId, node);

      preOrderBuild(node, tree);
    });
  }

  return;
};

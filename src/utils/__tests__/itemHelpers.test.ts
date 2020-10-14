import FormStructureNode from '@model/FormStructureNode';
import {
  createFakeChangeEvent,
  detectIsChildNode,
  getUniqueId,
  moveQuestion,
  moveQuestionToSpecificPosition,
  removeBeingPrecedingQuestion,
  removeFromFormStructure,
  removeFromSubquestions,
  removePrecedingQuestion
} from '@utils/itemHelpers';
import { Constants } from 's-forms';
import {
  CHILD_1,
  getPseudoRandomId,
  GRAND_CHILD_1,
  PARENT_1,
  QUESTION,
  QUESTION_WITH_PRECEDING_ATTRIBUTE
} from '../../../__mock__';
import FormStructure from '@model/FormStructure';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

describe('detectIsChildNode', () => {
  it('accepting node cannot be child if does not have parent', () => {
    const targetNode = new FormStructureNode(null, { ...QUESTION });
    const movingNode = new FormStructureNode(targetNode, PARENT_1);

    expect(detectIsChildNode(movingNode, targetNode)).toBeFalsy();
  });

  it('accepting node is child of target node', () => {
    const movingNode = new FormStructureNode(null, { ...PARENT_1 });
    const childNode = new FormStructureNode(movingNode, { ...CHILD_1 });
    const targetNode = new FormStructureNode(childNode, { ...GRAND_CHILD_1 });

    expect(detectIsChildNode(movingNode, targetNode)).toBeTruthy();
  });

  it('accepting node is not child of target node', () => {
    const movingNode = new FormStructureNode(null, { ...QUESTION });
    const randomNode = new FormStructureNode(null, { ...PARENT_1 });
    const targetNode = new FormStructureNode(randomNode, { ...CHILD_1 });

    expect(detectIsChildNode(movingNode, targetNode)).toBeFalsy();
  });
});

describe('removePrecedingQuestion', () => {
  it('removes preceding question from question if attribute is defined', () => {
    const node = new FormStructureNode(null, { ...QUESTION_WITH_PRECEDING_ATTRIBUTE });

    expect(node.data[Constants.HAS_PRECEDING_QUESTION]).toBeDefined();

    removePrecedingQuestion(node);

    expect(node.data[Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
  });

  it('does not remove anything if preceding question is not defined', () => {
    const node = new FormStructureNode(null, { ...QUESTION });

    expect(node.data[Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();

    removePrecedingQuestion(node);

    expect(node.data[Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
    expect({ ...node.data }).toEqual({ ...QUESTION });
  });
});

describe('removeBeingPrecedingQuestion', () => {
  it('removes being preceding question if the question is preceding question', () => {
    const movingNodeParent = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.HAS_SUBQUESTION]: [
        { ...QUESTION_WITH_PRECEDING_ATTRIBUTE },
        { ...QUESTION, '@id': QUESTION_WITH_PRECEDING_ATTRIBUTE[Constants.HAS_PRECEDING_QUESTION]['@id'] }
      ]
    });
    const movingNode = new FormStructureNode(null, {
      ...QUESTION,
      '@id': QUESTION_WITH_PRECEDING_ATTRIBUTE[Constants.HAS_PRECEDING_QUESTION]['@id']
    });

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    movingNodeParent.data[Constants.HAS_SUBQUESTION].forEach((question: FormStructureQuestion) => {
      expect(question[Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
    });
  });

  it("does nothing if question is not any other question's preceding question", () => {
    const movingNodeParent = new FormStructureNode(null, { ...PARENT_1 });
    const movingNodeChild = new FormStructureNode(null, { ...CHILD_1 });

    expect(movingNodeChild.data[Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();

    removeBeingPrecedingQuestion(movingNodeParent, movingNodeChild);

    expect(movingNodeChild.data[Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
    expect({ ...movingNodeChild.data }).toEqual({ ...CHILD_1 });
  });
});

describe('removeFromSubquestions', () => {
  it("removes certain question from question's subquestions and returns its index", () => {
    const parent = new FormStructureNode(null, {
      ...PARENT_1,
      [Constants.HAS_SUBQUESTION]: [{ ...CHILD_1 }, { ...QUESTION }]
    });
    const subquestion = new FormStructureNode(null, { ...CHILD_1 });

    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(2);

    const index = removeFromSubquestions(parent, subquestion);

    expect(index).toEqual(0);
    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(1);
    expect(parent.data[Constants.HAS_SUBQUESTION][0]).toEqual(QUESTION);
  });

  it('does not remove any question if question is not available and returns -1', () => {
    const parent = new FormStructureNode(null, {
      ...PARENT_1,
      [Constants.HAS_SUBQUESTION]: [{ ...QUESTION }]
    });
    const subquestion = new FormStructureNode(null, { ...CHILD_1 });

    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(1);

    const index = removeFromSubquestions(parent, subquestion);

    expect(index).toEqual(-1);
    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(1);
    expect(parent.data[Constants.HAS_SUBQUESTION][0]).toEqual(QUESTION);
  });
});

describe('removeFromFormStructure', () => {
  it('removes certain question and its subquestion from form structure', () => {
    const parent = new FormStructureNode(null, {
      ...PARENT_1,
      [Constants.HAS_SUBQUESTION]: [{ ...CHILD_1 }, { ...QUESTION }]
    });

    const child = new FormStructureNode(parent, { ...CHILD_1 });
    const grandChild = new FormStructureNode(child, { ...GRAND_CHILD_1 });

    const formStructure = new FormStructure(parent);

    formStructure.addNode(child);
    formStructure.addNode(grandChild);

    expect(formStructure.structure.size).toBe(3);

    removeFromFormStructure(formStructure, child);

    expect(formStructure.structure.size).toBe(1);
    expect(formStructure.getNode(child.data['@id'])).toBeUndefined();
    expect(formStructure.getNode(parent.data['@id'])).toEqual(parent);
  });
});

describe('moveQuestionToSpecificPosition', () => {
  it('move question to position 0', () => {
    const position = 0;

    const idQ1 = getPseudoRandomId();
    const idQ2 = getPseudoRandomId();
    const idQ3 = getPseudoRandomId();

    const question1 = { ...QUESTION, '@id': idQ1 };
    const question2 = { ...QUESTION, '@id': idQ2 };
    const question3 = { ...QUESTION, '@id': idQ3 };

    const targetNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.HAS_SUBQUESTION]: [question2, question3]
    });

    const movingNode = new FormStructureNode(null, question1);

    expect(targetNode.data[Constants.HAS_SUBQUESTION].length).toBe(2);

    moveQuestionToSpecificPosition(position, targetNode, movingNode);

    expect(targetNode.data[Constants.HAS_SUBQUESTION].length).toBe(3);
    expect(movingNode.parent).toBe(targetNode);
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position]).toEqual(question1);
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position + 1][Constants.HAS_PRECEDING_QUESTION]['@id']).toEqual(
      idQ1
    );
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position + 2][Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
  });

  it('move question to center position', () => {
    const position = 1;

    const idQ1 = getPseudoRandomId();
    const idQ2 = getPseudoRandomId();
    const idQ3 = getPseudoRandomId();

    const question1 = { ...QUESTION, '@id': idQ1 };
    const question2 = { ...QUESTION, '@id': idQ2 };
    const question3 = { ...QUESTION, '@id': idQ3 };

    const targetNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.HAS_SUBQUESTION]: [question2, question3]
    });

    const movingNode = new FormStructureNode(null, question1);

    expect(targetNode.data[Constants.HAS_SUBQUESTION].length).toBe(2);

    moveQuestionToSpecificPosition(position, targetNode, movingNode);

    expect(targetNode.data[Constants.HAS_SUBQUESTION].length).toBe(3);
    expect(movingNode.parent).toBe(targetNode);

    expect(targetNode.data[Constants.HAS_SUBQUESTION][position]).toEqual({
      ...question1,
      [Constants.HAS_PRECEDING_QUESTION]: { '@id': idQ2 }
    });
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position + 1][Constants.HAS_PRECEDING_QUESTION]['@id']).toEqual(
      idQ1
    );
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position - 1][Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
  });

  it('move question to last position', () => {
    const position = 2;

    const idQ1 = getPseudoRandomId();
    const idQ2 = getPseudoRandomId();
    const idQ3 = getPseudoRandomId();

    const question1 = { ...QUESTION, '@id': idQ1 };
    const question2 = { ...QUESTION, '@id': idQ2 };
    const question3 = { ...QUESTION, '@id': idQ3 };

    const targetNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.HAS_SUBQUESTION]: [question2, question3]
    });

    const movingNode = new FormStructureNode(null, question1);

    expect(targetNode.data[Constants.HAS_SUBQUESTION].length).toBe(2);

    moveQuestionToSpecificPosition(position, targetNode, movingNode);

    expect(targetNode.data[Constants.HAS_SUBQUESTION].length).toBe(3);
    expect(movingNode.parent).toBe(targetNode);

    expect(targetNode.data[Constants.HAS_SUBQUESTION][position]).toEqual({
      ...question1,
      [Constants.HAS_PRECEDING_QUESTION]: { '@id': idQ3 }
    });
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position - 1][Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
    expect(targetNode.data[Constants.HAS_SUBQUESTION][position - 2][Constants.HAS_PRECEDING_QUESTION]).toBeUndefined();
  });
});

describe('moveQuestion', () => {
  it('moves question to target without any subquestions', () => {
    const parent = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.HAS_SUBQUESTION]: undefined
    });

    const movingNode = new FormStructureNode(parent, { ...GRAND_CHILD_1 });

    moveQuestion(movingNode, parent);

    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(1);
    expect(parent.data[Constants.HAS_SUBQUESTION][0]).toEqual(GRAND_CHILD_1);
    expect(movingNode.parent).toEqual(parent);
  });

  it('moves question to target with subquestions', () => {
    const parent = new FormStructureNode(null, {
      ...PARENT_1
    });

    const movingNode = new FormStructureNode(parent, { ...QUESTION });

    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(1);

    moveQuestion(movingNode, parent);

    expect(parent.data[Constants.HAS_SUBQUESTION].length).toBe(2);
    expect(movingNode.parent).toEqual(parent);
  });
});

describe('getUniqueId', () => {
  it('gets kebab-case id generated from label', () => {
    const root = new FormStructureNode(null, { ...QUESTION });

    const formStructure = new FormStructure(root);

    const id = getUniqueId('Form Editor', formStructure);

    expect(id.startsWith('form-editor-')).toBeTruthy();
    expect(id.length > 'form-editor-'.length).toBeTruthy();
  });
});

describe('createFakeChangeEvent', () => {
  it('gets fake change event with label and value specified', () => {
    const label = 'label';
    const value = { test: 'test' };
    const fakeEvent = createFakeChangeEvent(label, value);

    expect(fakeEvent).toEqual({
      target: {
        name: label,
        value: value
      }
    });
  });
});

import { Constants } from 's-forms';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

export const QUESTION: FormStructureQuestion = {
  '@id': 'mock-question',
  '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
  [Constants.RDFS_LABEL]: 'Mock question',
  [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.TEXT]
};

export const QUESTION_WITH_PRECEDING_ATTRIBUTE: FormStructureQuestion = {
  ...QUESTION,
  [Constants.HAS_PRECEDING_QUESTION]: {
    ...QUESTION,
    '@id': 'mock-preceding-question'
  }
};

export const GRAND_CHILD_1: FormStructureQuestion = { ...QUESTION, '@id': 'baby_1' };

export const CHILD_1: FormStructureQuestion = {
  ...QUESTION,
  '@id': 'child_1',
  [Constants.HAS_SUBQUESTION]: [GRAND_CHILD_1]
};

export const PARENT_1: FormStructureQuestion = {
  ...QUESTION,
  '@id': 'parent_1',
  [Constants.HAS_SUBQUESTION]: [CHILD_1]
};

export const getPseudoRandomId = () => {
  return Math.floor(Math.random() * 100000000);
};

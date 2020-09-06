import { Constants } from 's-forms';

export const NEW_ITEM = {
  '@id': '',
  '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
  [Constants.LAYOUT_CLASS]: [],
  [Constants.HAS_SUBQUESTION]: []
};

export const NEW_PAGE_ITEM = {
  '@id': '',
  '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
  [Constants.LAYOUT_CLASS]: ['section', 'wizard-step'],
  [Constants.HAS_SUBQUESTION]: []
};

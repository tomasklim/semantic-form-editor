import { Constants } from 's-forms';

export const NEW_QUESTION = {
  '@id': '',
  '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
  [Constants.LAYOUT_CLASS]: [],
  [Constants.HAS_SUBQUESTION]: []
};

export const NEW_WIZARD_SECTION_QUESTION = {
  '@id': '',
  '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
  [Constants.LAYOUT_CLASS]: ['section', 'wizard-step'],
  [Constants.HAS_SUBQUESTION]: []
};

export const LOCAL_STORAGE_SIDEBAR_WIDTH = 'sidebar_width';
export const TEXT_FIELD = 'text';

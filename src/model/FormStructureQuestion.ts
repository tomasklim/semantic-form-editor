import { Constants } from 's-forms';

export interface FormStructureQuestion {
  '@id': string;
  '@type': string;
  [Constants.RDFS_LABEL]: string;
  [Constants.LAYOUT_CLASS]?: Array<string> | string;
  [Constants.HAS_PRECEDING_QUESTION]?: { '@id': string };
  [Constants.HAS_SUBQUESTION]?: Array<FormStructureQuestion> | undefined;
  [Constants.IS_RELEVANT_IF]?: string;
  [Constants.REQUIRES_ANSWER]?: boolean;
  [Constants.HELP_DESCRIPTION]?: string;
  [Constants.HAS_QUESTION_ORIGIN]?: string;
  [Constants.HAS_POSSIBLE_VALUES_QUERY]?: string;
  [Constants.ACCEPTS_ANSWER_VALUE]?: boolean;
  [Constants.HAS_TESTED_QUESTION]?: boolean;
}

// @ts-nocheck
import { Constants } from 's-forms';

/* if you add attribute to model and generate value for it in code, add it also to constant below */
export interface FormStructureQuestion {
  '@id': string;
  '@type': string;
  [Constants.RDFS_LABEL]?: string | Array<LanguageObject>;
  [Constants.LAYOUT_CLASS]: Array<string>;
  [Constants.HAS_PRECEDING_QUESTION]?: { '@id': string };
  [Constants.HAS_SUBQUESTION]?: Array<FormStructureQuestion> | undefined;
  [Constants.REQUIRES_ANSWER]?: boolean;
  [Constants.HELP_DESCRIPTION]?: string | Array<LanguageObject>;
  [Constants.RDFS_COMMENT]?: string;
  [Constants.INPUT_MASK]?: string;
  [Constants.HAS_OPTIONS_QUERY]?: string;
  [key: string]: any;
}

export const FORM_STRUCTURE_QUESTION_ATTRIBUTES = [
  '@id',
  '@type',
  Constants.RDFS_LABEL,
  Constants.LAYOUT_CLASS,
  Constants.INPUT_MASK,
  Constants.HAS_OPTIONS_QUERY,
  Constants.HELP_DESCRIPTION,
  Constants.HAS_SUBQUESTION,
  Constants.HAS_PRECEDING_QUESTION,
  Constants.REQUIRES_ANSWER
];

export type LanguageObject = {
  '@language': string;
  '@value': string;
};

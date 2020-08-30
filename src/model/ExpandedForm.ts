import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureQuestion } from './FormStructureQuestion';

export interface ExpandedForm extends JsonLdObj {
  '@graph': Array<FormStructureQuestion>;
  '@context': JsonLdObj;
}

import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureQuestion } from '../model/FormStructureQuestion';

export interface EForm extends JsonLdObj {
  '@graph': Array<FormStructureQuestion>;
}

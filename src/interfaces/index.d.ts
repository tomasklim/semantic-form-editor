import { ENodeData } from '../model/ENode';
import { JsonLdObj } from 'jsonld/jsonld-spec';

export interface EForm extends JsonLdObj {
  '@graph': Array<ENodeData>;
}

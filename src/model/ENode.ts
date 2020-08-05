import { Constants } from 's-forms';

export interface ENodeData {
  '@id': string;
  '@type': string;
  [Constants.HAS_SUBQUESTION]?: Array<ENodeData> | undefined;
  [Constants.RDFS_LABEL]: string;
  [Constants.HAS_LAYOUT_CLASS]: Array<string> | string;
  [Constants.HAS_PRECEDING_QUESTION]?: { '@id': string };
}

class ENode {
  public parent: ENode | null;
  public data: ENodeData;

  constructor(parent: ENode | null, data: any) {
    this.parent = parent;
    this.data = data;
  }
}

export default ENode;

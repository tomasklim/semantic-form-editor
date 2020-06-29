export interface ENodeData {
  '@id': string;
  '@type': string;
  has_related_question: Array<string>;
  'has-layout-class': Array<string> | string;
  'has-preceding-question': string;
  'is-relevant-if': string;
  label: string;
}

class ENode {
  public parent: string | null;
  public data: ENodeData;

  constructor(parent: string | null, data: any) {
    this.parent = parent;
    this.data = data;
  }
}

export default ENode;

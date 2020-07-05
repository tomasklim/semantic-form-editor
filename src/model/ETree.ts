import ENode from './ENode';

class ETree {
  public root: ENode;
  public structure: Map<string, ENode>;

  constructor(root: ENode) {
    this.structure = new Map<string, ENode>();
    this.root = root;
  }

  getRoot() {
    return this.root;
  }

  addNode(nodeId: string, node: ENode) {
    this.structure.set(nodeId, node);
  }
}

export default ETree;

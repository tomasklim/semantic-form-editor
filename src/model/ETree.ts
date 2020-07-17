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

  getNode(nodeId: string): ENode | undefined {
    return this.structure.get(nodeId);
  }
}

export default ETree;

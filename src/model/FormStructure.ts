import FormStructureNode from './FormStructureNode';

class FormStructure {
  public root: FormStructureNode;
  public structure: Map<string, FormStructureNode>;

  constructor(root: FormStructureNode) {
    this.structure = new Map<string, FormStructureNode>();
    this.root = root;
  }

  getRoot() {
    return this.root;
  }

  addNode(nodeId: string, node: FormStructureNode) {
    this.structure.set(nodeId, node);
  }

  getNode(nodeId: string): FormStructureNode | undefined {
    return this.structure.get(nodeId);
  }

  removeNode(nodeId: string): void {
    this.structure.delete(nodeId);
  }
}

export default FormStructure;

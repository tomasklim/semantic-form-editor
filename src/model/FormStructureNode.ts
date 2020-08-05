import { FormStructureQuestion } from './FormStructureQuestion';

class FormStructureNode {
  public parent: FormStructureNode | null;
  public data: FormStructureQuestion;

  constructor(parent: FormStructureNode | null, data: any) {
    this.parent = parent;
    this.data = data;
  }
}

export default FormStructureNode;

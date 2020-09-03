import React, { Dispatch, SetStateAction, useState } from 'react';
import { cloneDeep } from 'lodash';
import FormStructure from '@model/FormStructure';
import {
  highlightQuestion,
  moveQuestion,
  removeBeingPrecedingQuestion,
  removeFromSubQuestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '@utils/formBuilder';
import { Constants } from 's-forms';
import FormStructureNode from '@model/FormStructureNode';
import { JsonLdObj } from 'jsonld/jsonld-spec';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  addNewFormStructureNode: (targetId: string) => void;
  moveNodeUnderNode: (movingNodeId: string, destinationPageId: string) => void;
  formStructure: FormStructure;
  formFile: JsonLdObj;
  setFormFile: Dispatch<SetStateAction<FormStructure>>;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
  setFormContext: Dispatch<SetStateAction<JsonLdObj>>;
  getClonedFormStructure: () => FormStructure;
  formContext: JsonLdObj;
}

// @ts-ignore
const FormStructureContext = React.createContext<FormStructureContextValues>({});

const FormStructureProvider: React.FC<FormStructureProviderProps> = ({ children }) => {
  // @ts-ignore
  const [formStructure, setFormStructure] = useState<FormStructure>(null);
  // @ts-ignore
  const [formContext, setFormContext] = useState<JsonLdObj>(null);
  // @ts-ignore
  const [formFile, setFormFile] = useState<JsonLdObj>(null);

  const getClonedFormStructure = (): FormStructure => {
    return cloneDeep(formStructure)!;
  };

  const addNewFormStructureNode = (targetId: string) => {
    const clonedFormStructure = getClonedFormStructure();

    const id = Math.floor(Math.random() * 10000) + 'formstructure';

    // temporary
    const newQuestion = {
      '@id': id,
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      [Constants.LAYOUT_CLASS]: ['new'],
      [Constants.RDFS_LABEL]: id,
      [Constants.HAS_SUBQUESTION]: []
    };

    const targetNode = clonedFormStructure.getNode(targetId);

    if (!targetNode) {
      console.error('Missing targetNode');
      return;
    }

    const node = new FormStructureNode(targetNode, newQuestion);

    clonedFormStructure.addNode(newQuestion['@id'], node);

    moveQuestion(node, targetNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(id);
  };

  const moveNodeUnderNode = (movingNodeId: string, destinationPageId: string) => {
    const clonedFormStructure = getClonedFormStructure();

    const movingNode = clonedFormStructure.structure.get(movingNodeId);
    const destinationPage = clonedFormStructure.structure.get(destinationPageId);

    if (!movingNode?.data || !movingNode?.parent || !destinationPage?.data) {
      console.warn("Missing movingNode's data or parent, or destination's data");
      return;
    }

    const movingNodeParent = movingNode.parent;

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    removeFromSubQuestions(movingNodeParent, movingNode);

    moveQuestion(movingNode, destinationPage);

    destinationPage.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      destinationPage.data[Constants.HAS_SUBQUESTION]
    );

    setFormStructure(clonedFormStructure);

    highlightQuestion(movingNodeId);
  };

  const values = React.useMemo<FormStructureContextValues>(
    () => ({
      addNewFormStructureNode,
      moveNodeUnderNode,
      getClonedFormStructure,
      setFormStructure,
      setFormContext,
      formStructure,
      formContext,
      formFile,
      setFormFile
    }),
    [formFile, formStructure, formContext]
  );

  return <FormStructureContext.Provider value={values}>{children}</FormStructureContext.Provider>;
};

export { FormStructureContext, FormStructureProvider };

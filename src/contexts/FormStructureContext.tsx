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
import { JsonLdObj } from 'jsonld/jsonld-spec';
import FormStructureNode from '@model/FormStructureNode';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  addNewNode: AddNewFormStructureNode;
  moveNodeUnderNode: (movingNodeId: string, destinationPageId: string) => void;
  formStructure: FormStructure;
  formFile: JsonLdObj;
  setFormFile: Dispatch<SetStateAction<FormStructure>>;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
  setFormContext: Dispatch<SetStateAction<JsonLdObj>>;
  getClonedFormStructure: () => FormStructure;
  formContext: JsonLdObj;
}

type AddNewFormStructureNode = (
  newItemData: FormStructureQuestion,
  targetNode: FormStructureNode,
  clonedFormStructure: FormStructure
) => void;

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

  const addNewNode: AddNewFormStructureNode = (newItemData, targetNode, clonedFormStructure) => {
    const node = new FormStructureNode(targetNode, newItemData);

    clonedFormStructure.addNode(newItemData['@id'], node);

    moveQuestion(node, targetNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(newItemData['@id']);
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
      addNewNode,
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

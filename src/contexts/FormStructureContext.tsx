import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Constants, FormUtils } from 's-forms';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import FormStructure from '@model/FormStructure';
import {
  detectIsChildNode,
  highlightQuestion,
  isSectionOrWizardStep,
  moveQuestion,
  removeBeingPrecedingQuestion,
  removeFromSubQuestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '@utils/index';
import FormStructureNode from '@model/FormStructureNode';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  addNewNode: AddNewFormStructureNode;
  moveNodeUnderNode: (movingNodeId: string, destinationNodeId: string, wizard?: boolean) => void;
  formStructure: FormStructure;
  formFile: JsonLdObj;
  setFormFile: Dispatch<SetStateAction<FormStructure>>;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
  setFormContext: Dispatch<SetStateAction<JsonLdObj>>;
  getClonedFormStructure: () => FormStructure;
  formContext: JsonLdObj;
  updateNode: Function;
  isWizardless: boolean | undefined;
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
  // @ts-ignore
  const [isWizardless, setIsWizardless] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (formStructure?.root?.data && formStructure.root.data[Constants.HAS_SUBQUESTION]) {
      const rootSubQuestions = formStructure.root.data[Constants.HAS_SUBQUESTION];

      if (!rootSubQuestions?.length) {
        setIsWizardless(undefined);
      } else {
        const isWizardless = rootSubQuestions.every((question) => !FormUtils.isWizardStep(question));
        setIsWizardless(isWizardless);
      }
    }
  }, [formStructure]);

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

  const moveNodeUnderNode = (movingNodeId: string, destinationNodeId: string, wizard: boolean = false) => {
    const clonedFormStructure = getClonedFormStructure();

    const movingNode = clonedFormStructure.structure.get(movingNodeId);
    const destinationNode = clonedFormStructure.structure.get(destinationNodeId);

    if (!movingNode?.data || !movingNode?.parent || !destinationNode?.data) {
      console.warn("Missing movingNode's data or parent, or destination's data");
      return;
    }

    // if target element is child of moving element => no highlight
    if (movingNode && destinationNode && detectIsChildNode(movingNode, destinationNode)) {
      console.warn('Cannot move item under the same item!');
      return;
    }

    // if moving node is non-section element => no highlight on wizard adds
    if (wizard && !isWizardless && !isSectionOrWizardStep(movingNode)) {
      return;
    }

    const layoutClass = movingNode.data[Constants.LAYOUT_CLASS];

    if (wizard && !isWizardless && !layoutClass.includes(Constants.LAYOUT.WIZARD_STEP)) {
      layoutClass.push(Constants.LAYOUT.WIZARD_STEP);
    } else if (!wizard && !isWizardless && layoutClass.includes(Constants.LAYOUT.WIZARD_STEP)) {
      layoutClass.splice(layoutClass.indexOf(Constants.LAYOUT.WIZARD_STEP), 1);
    }

    const movingNodeParent = movingNode.parent;

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    removeFromSubQuestions(movingNodeParent, movingNode);

    moveQuestion(movingNode, destinationNode);

    destinationNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      destinationNode.data[Constants.HAS_SUBQUESTION]
    );

    setFormStructure(clonedFormStructure);

    highlightQuestion(movingNodeId);
  };

  const updateNode = (itemData: FormStructureQuestion) => {
    const clonedFormStructure = getClonedFormStructure();

    const node = clonedFormStructure.structure.get(itemData['@id']);

    if (!node) {
      console.warn('Not existing node id', clonedFormStructure, itemData);
      return;
    }

    Object.keys(node.data).forEach((key) => {
      if (!itemData[key]) {
        delete node.data[key];
      }
    });

    Object.keys(itemData).forEach((key) => {
      node.data[key] = itemData[key];
    });

    setFormStructure(clonedFormStructure);
  };

  const values = React.useMemo<FormStructureContextValues>(
    () => ({
      addNewNode,
      moveNodeUnderNode,
      getClonedFormStructure,
      updateNode,
      setFormStructure,
      setFormContext,
      formStructure,
      formContext,
      formFile,
      setFormFile,
      isWizardless
    }),
    [formFile, formStructure, formContext, isWizardless]
  );

  return <FormStructureContext.Provider value={values}>{children}</FormStructureContext.Provider>;
};

export { FormStructureContext, FormStructureProvider };

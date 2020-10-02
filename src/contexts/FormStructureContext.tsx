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
  buildFormStructureResursion,
  removeBeingPrecedingQuestion,
  removeFromSubquestions,
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
  moveNodeUnderNode: (movingNodeId: string, targetNodeId: string, isWizardPosition?: boolean) => void;
  formStructure: FormStructure;
  formFile: JsonLdObj | null;
  setFormFile: Dispatch<SetStateAction<FormStructure | null>>;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
  setFormContext: Dispatch<SetStateAction<JsonLdObj>>;
  getClonedFormStructure: () => FormStructure;
  formContext: JsonLdObj;
  updateNode: Function;
  isWizardless: boolean | undefined;
}

type AddNewFormStructureNode = (
  newItemData: FormStructureQuestion | Array<FormStructureQuestion>,
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
  const [formFile, setFormFile] = useState<JsonLdObj | null>(null);
  // @ts-ignore
  const [isWizardless, setIsWizardless] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (formStructure?.root?.data && formStructure.root.data[Constants.HAS_SUBQUESTION]) {
      const rootSubquestions = formStructure.root.data[Constants.HAS_SUBQUESTION];

      if (!rootSubquestions?.length) {
        setIsWizardless(undefined);
      } else {
        const isWizardless = rootSubquestions.every((question) => !FormUtils.isWizardStep(question));
        setIsWizardless(isWizardless);
      }
    }
  }, [formStructure]);

  const getClonedFormStructure = (): FormStructure => {
    return cloneDeep(formStructure)!;
  };

  const addNewNode: AddNewFormStructureNode = (newItemData, targetNode, clonedFormStructure) => {
    if (Array.isArray(newItemData)) {
      newItemData.forEach((question) => {
        const node = new FormStructureNode(targetNode, question);
        clonedFormStructure.addNode(question['@id'], node);

        buildFormStructureResursion(node, clonedFormStructure);
        moveQuestion(node, targetNode);

        highlightQuestion(question['@id']);
      });

      targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

      setFormStructure(clonedFormStructure);

      return;
    }

    const node = new FormStructureNode(targetNode, newItemData);

    clonedFormStructure.addNode(newItemData['@id'], node);

    moveQuestion(node, targetNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(newItemData['@id']);
  };

  const moveNodeUnderNode = (movingNodeId: string, targetNodeId: string, isWizardPosition: boolean = false) => {
    const clonedFormStructure = getClonedFormStructure();

    const movingNode = clonedFormStructure.structure.get(movingNodeId);
    const targetNode = clonedFormStructure.structure.get(targetNodeId);

    if (!movingNode?.data || !movingNode?.parent || !targetNode?.data) {
      console.warn("Missing movingNode's data or parent, or target's data");
      return;
    }

    // if target element is child of moving element => no highlight
    if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
      console.warn("Cannot move item under it's child item!");
      return;
    }

    // if moving node is non-section element => no highlight on wizard adds
    if (isWizardPosition && !isWizardless && !isSectionOrWizardStep(movingNode)) {
      return;
    }

    const layoutClass = movingNode.data[Constants.LAYOUT_CLASS];

    if (isWizardPosition && !isWizardless && !layoutClass.includes(Constants.LAYOUT.WIZARD_STEP)) {
      layoutClass.push(Constants.LAYOUT.WIZARD_STEP);
    } else if (!isWizardPosition && !isWizardless && layoutClass.includes(Constants.LAYOUT.WIZARD_STEP)) {
      layoutClass.splice(layoutClass.indexOf(Constants.LAYOUT.WIZARD_STEP), 1);
    }

    const movingNodeParent = movingNode.parent;

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    removeFromSubquestions(movingNodeParent, movingNode);

    moveQuestion(movingNode, targetNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);

    highlightQuestion(movingNodeId);
  };

  const updateNode = (question: FormStructureQuestion) => {
    const clonedFormStructure = getClonedFormStructure();

    const node = clonedFormStructure.structure.get(question['@id']);

    if (!node) {
      console.warn('Not existing node id', clonedFormStructure, question);
      return;
    }

    Object.keys(node.data).forEach((key) => {
      if (!question[key]) {
        delete node.data[key];
      }
    });

    Object.keys(question).forEach((key) => {
      node.data[key] = question[key];
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

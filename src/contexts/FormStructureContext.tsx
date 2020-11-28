import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Constants, FormUtils, Intl } from 's-forms';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import FormStructure from '@model/FormStructure';
import {
  buildFormStructureResursion,
  detectIsChildNode,
  highlightQuestion,
  isSectionOrWizardStep,
  moveQuestion,
  removeBeingPrecedingQuestion,
  removeFromSubquestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '@utils/index';
import FormStructureNode from '@model/FormStructureNode';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { exportForm } from '../utils';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  addNewNodes: AddNewFormStructureNode;
  moveNodeUnderNode: (movingNodeId: string, targetNodeId: string, isWizardPosition: boolean, intl: Intl) => void;
  formStructure: FormStructure;
  formFile: JsonLdObj | null;
  setFormFile: Dispatch<SetStateAction<FormStructure | null>>;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
  updateFormStructure: (form: FormStructure) => void;
  setFormContext: Dispatch<SetStateAction<JsonLdObj>>;
  getClonedFormStructure: () => FormStructure;
  formContext: JsonLdObj;
  updateNode: (question: FormStructureQuestion, intl: Intl) => void;
  isWizardless: boolean;
  setIsWizardless: Dispatch<SetStateAction<boolean>>;
  isEmptyFormStructure: boolean;
  resetFormStructureContext: () => void;
}

type AddNewFormStructureNode = (
  newItemData: FormStructureQuestion | Array<FormStructureQuestion>,
  targetNode: FormStructureNode,
  intl: Intl
) => void;

// @ts-ignore
const FormStructureContext = React.createContext<FormStructureContextValues>({});

const FormStructureProvider: React.FC<FormStructureProviderProps> = ({ children }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // @ts-ignore
  const [formStructure, setFormStructure] = useState<FormStructure>(null);
  // @ts-ignore
  const [formContext, setFormContext] = useState<JsonLdObj>(null);
  const [formFile, setFormFile] = useState<JsonLdObj | null>(null);
  // @ts-ignore
  const [isWizardless, setIsWizardless] = useState<boolean>(true);
  const [isEmptyFormStructure, setIsEmptyFormStructure] = useState<boolean>(true);

  const resetFormStructureContext = () => {
    // @ts-ignore
    setFormStructure(null);
    // @ts-ignore
    setFormContext(null);
    setFormFile(null);
    setIsWizardless(true);
    setIsEmptyFormStructure(true);
  };

  const updateFormStructure = async (form: FormStructure) => {
    if (router.query.formUrl && router.query.draftUpdate === 'true') {
      setFormStructure(cloneDeep(form));

      const clonedForm = cloneDeep(form);

      const exportedForm = await exportForm(clonedForm, formContext);

      try {
        // @ts-ignore
        await fetch(router.query.formUrl, { method: 'PUT', body: JSON.stringify(exportedForm) });
      } catch (error) {
        enqueueSnackbar('Update to server failed!', {
          variant: 'error'
        });
      }
    } else {
      setFormStructure(cloneDeep(form));
    }
  };

  useEffect(() => {
    if (formStructure?.root?.data && formStructure.root.data[Constants.HAS_SUBQUESTION]) {
      const rootSubquestions = formStructure.root.data[Constants.HAS_SUBQUESTION];

      if (!rootSubquestions?.length) {
        setIsEmptyFormStructure(true);
      } else {
        const isWizardless = rootSubquestions.every(
          (question: FormStructureQuestion) => !FormUtils.isWizardStep(question)
        );

        setIsWizardless(isWizardless);
        setIsEmptyFormStructure(false);
      }
    }
  }, [formStructure]);

  const getClonedFormStructure = (): FormStructure => {
    return cloneDeep(formStructure)!;
  };

  const addNewNodes: AddNewFormStructureNode = (questions, targetNode, intl) => {
    if (!Array.isArray(questions)) {
      questions = [questions];
    }

    questions.forEach((question) => {
      const node = new FormStructureNode(targetNode, question);
      formStructure.addNode(node);

      buildFormStructureResursion(node, formStructure, intl);
      moveQuestion(node, targetNode);

      highlightQuestion(question['@id']);
    });

    sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION], intl);

    updateFormStructure(formStructure);

    enqueueSnackbar(
      questions.length === 1 ? `New question has been created!` : `${questions.length} new questions have been added!`,
      {
        variant: 'success'
      }
    );
  };

  const moveNodeUnderNode = (movingNodeId: string, targetNodeId: string, isWizardPosition: boolean, intl: Intl) => {
    const movingNode = formStructure.structure.get(movingNodeId);
    const targetNode = formStructure.structure.get(targetNodeId);

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

    const layoutClass = movingNode.data[Constants.LAYOUT_CLASS] || [];

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

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION], intl);

    updateFormStructure(formStructure);

    highlightQuestion(movingNodeId);

    enqueueSnackbar(`Question with id "${movingNode.data['@id']}" has been moved!`, {
      variant: 'success'
    });
  };

  const updateNode = (question: FormStructureQuestion, intl: Intl) => {
    const node = formStructure.structure.get(question['@id']);

    if (!node) {
      console.warn('Not existing node id', formStructure, question);
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

    const parent = node.parent;

    if (parent) {
      parent.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(parent.data[Constants.HAS_SUBQUESTION], intl);
    }

    updateFormStructure(formStructure);

    enqueueSnackbar(`Question with id "${question['@id']}" has been updated!`, {
      variant: 'success'
    });
  };

  const values = React.useMemo<FormStructureContextValues>(
    () => ({
      addNewNodes,
      moveNodeUnderNode,
      getClonedFormStructure,
      updateNode,
      setFormStructure,
      updateFormStructure,
      setFormContext,
      formStructure,
      formContext,
      formFile,
      setFormFile,
      isWizardless,
      setIsWizardless,
      isEmptyFormStructure,
      resetFormStructureContext
    }),
    [formFile, formStructure, formContext, isWizardless, isEmptyFormStructure]
  );

  return <FormStructureContext.Provider value={values}>{children}</FormStructureContext.Provider>;
};

export { FormStructureContext, FormStructureProvider };

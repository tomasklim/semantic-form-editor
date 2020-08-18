import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import FormStructure from '../model/FormStructure';
import { buildFormStructure, highlightQuestion, moveQuestion, sortRelatedQuestions } from '../utils/formBuilder';
import { Constants } from 's-forms';
import FormStructureNode from '../model/FormStructureNode';
import { JsonLdObj } from 'jsonld/jsonld-spec';

interface FormStructureProviderProps {
  children: React.ReactNode;
}

interface FormStructureContextValues {
  addNewFormStructureNode: (targetId: string) => void;
  formStructure: FormStructure;
  setFormStructure: Dispatch<SetStateAction<FormStructure>>;
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

  useEffect(() => {
    async function getFormStructure() {
      const form = require('../utils/form.json');
      const formStructure = await buildFormStructure(form);

      setFormStructure(formStructure);
      setFormContext(form['@context']);
    }

    getFormStructure();
  }, []);

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
      [Constants.HAS_LAYOUT_CLASS]: ['new'],
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

  const values = React.useMemo<FormStructureContextValues>(
    () => ({
      addNewFormStructureNode,
      getClonedFormStructure,
      setFormStructure,
      formStructure,
      formContext
    }),
    [formStructure, formContext]
  );

  if (!formStructure) {
    return null;
  }

  return <FormStructureContext.Provider value={values}>{children}</FormStructureContext.Provider>;
};

export { FormStructureContext, FormStructureProvider };

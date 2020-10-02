import React, { FC, useContext, useEffect, useRef } from 'react';
import useStyles, { CustomisedAccordionDetails } from './ItemFormEmpty.styles';
import { Accordion } from '@material-ui/core';
import { FormStructureContext } from '@contexts/FormStructureContext';
import AddIcon from '@material-ui/icons/Add';
import { CustomiseQuestionContext, OnSaveCallback } from '@contexts/CustomiseQuestionContext';
import { NEW_QUESTION, NEW_WIZARD_SECTION_QUESTION } from '../../../constants';

type ItemFormEmptyProps = {};

const ItemFormEmpty: FC<ItemFormEmptyProps> = ({}) => {
  const classes = useStyles();
  const itemFormEmptyContainer = useRef<HTMLDivElement | null>(null);

  const { getClonedFormStructure, addNewNode, isWizardless } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);

  useEffect(() => {
    addNewTopLevelQuestion();
  }, []);

  const addNewTopLevelQuestion = () => {
    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.warn('Missing root question!', clonedFormStructure);
      return;
    }

    itemFormEmptyContainer.current?.classList.add(classes.pageHighlight);

    customiseQuestion({
      customisingQuestion: isWizardless === false ? { ...NEW_WIZARD_SECTION_QUESTION } : { ...NEW_QUESTION },
      onSave: (): OnSaveCallback => (customisingQuestion) => addNewNode(customisingQuestion, root, clonedFormStructure),
      isNewQuestion: true
    });
  };

  return (
    <div className={classes.itemFormEmptyContainer} ref={itemFormEmptyContainer}>
      <Accordion expanded={true} className={classes.accordion} title="Add new question">
        <CustomisedAccordionDetails>
          <AddIcon />
        </CustomisedAccordionDetails>
      </Accordion>
    </div>
  );
};

export default ItemFormEmpty;

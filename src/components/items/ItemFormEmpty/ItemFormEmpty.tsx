import React, { FC, useContext, useEffect, useRef } from 'react';
import useStyles, { CustomisedAccordionDetails } from './ItemFormEmpty.styles';
import { Accordion } from '@material-ui/core';
import { FormStructureContext } from '@contexts/FormStructureContext';
import AddIcon from '@material-ui/icons/Add';
import { CustomiseQuestionContext, OnSaveQuestionsCallback } from '@contexts/CustomiseQuestionContext';
import { NEW_QUESTION, NEW_WIZARD_SECTION_QUESTION } from '@constants/index';
import { EditorContext } from '@contexts/EditorContext';

type ItemFormEmptyProps = {};

const ItemFormEmpty: FC<ItemFormEmptyProps> = ({}) => {
  const classes = useStyles();
  const itemFormEmptyContainer = useRef<HTMLDivElement | null>(null);

  const { formStructure, addNewNodes, isWizardless } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);
  const { intl } = useContext(EditorContext);

  useEffect(() => {
    addNewTopLevelQuestion();
  }, [isWizardless]);

  const addNewTopLevelQuestion = () => {
    const root = formStructure.getRoot();

    if (!root) {
      console.warn('Missing root question!', formStructure);
      return;
    }

    const addButton = document.getElementById(!isWizardless ? 'add-new-wizard-step-button' : 'add-new-question');
    itemFormEmptyContainer.current?.classList.add(classes.itemSectionHighlight);
    addButton?.classList.add(classes.buttonHighlight);

    customiseQuestion({
      customisingQuestion: !isWizardless ? { ...NEW_WIZARD_SECTION_QUESTION } : { ...NEW_QUESTION },
      onSave: (): OnSaveQuestionsCallback => (questions) => {
        addNewNodes(questions, root, intl);
        addButton?.classList.add(classes.buttonHighlight);
      },
      isNewQuestion: true,
      nestedLevel: 0
    });
  };

  return (
    <div className={classes.itemFormEmptyContainer} ref={itemFormEmptyContainer} id="empty-form">
      <Accordion expanded={true} className={classes.accordion} title="Add new question">
        <CustomisedAccordionDetails>
          <AddIcon />
        </CustomisedAccordionDetails>
      </Accordion>
    </div>
  );
};

export default ItemFormEmpty;

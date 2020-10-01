import React, { FC, useContext, useRef } from 'react';
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

  const addNewTopLevelQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();

    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.warn('Missing root question!', clonedFormStructure);
      return;
    }

    customiseQuestion({
      customisingQuestion: isWizardless === false ? NEW_WIZARD_SECTION_QUESTION : NEW_QUESTION,
      onSave: (): OnSaveCallback => (customisingQuestion) => addNewNode(customisingQuestion, root, clonedFormStructure),
      onCancel: () => () => itemFormEmptyContainer.current?.classList.remove(classes.pageHighlight),
      onInit: () => itemFormEmptyContainer.current?.classList.add(classes.pageHighlight),
      isNewQuestion: true
    });
  };

  return (
    <div className={classes.page} ref={itemFormEmptyContainer}>
      <Accordion
        expanded={true}
        className={classes.accordion}
        onClick={addNewTopLevelQuestion}
        title={isWizardless === false ? 'Add new wizard step' : 'Add new question'}
      >
        <CustomisedAccordionDetails>
          <AddIcon />
        </CustomisedAccordionDetails>
      </Accordion>
    </div>
  );
};

export default ItemFormEmpty;

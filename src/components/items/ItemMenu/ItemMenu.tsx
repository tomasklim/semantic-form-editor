import React, { FC, useContext, useRef, useState } from 'react';
import { MoreVert } from '@material-ui/icons';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { Constants } from 's-forms';
import { removeFromFormStructure, removeFromSubquestions, sortRelatedQuestions } from '@utils/index';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import AddIcon from '@material-ui/icons/Add';
import SquaredIconButton from '@styles/SquaredIconButton';
import { CustomiseQuestionContext, OnSaveQuestionsCallback } from '@contexts/CustomiseQuestionContext';
import useStyles from './ItemMenu.styles';
import { NEW_QUESTION } from '../../../constants';
import { EditorContext } from '@contexts/EditorContext';

interface Props {
  question: FormStructureQuestion;
}

const ItemMenu: FC<Props> = ({ question }) => {
  const classes = useStyles();

  const { getClonedFormStructure, setFormStructure, addNewNodes } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);
  const { updateSFormsConfig, activeStep, setActiveStep } = useContext(EditorContext);

  const [open, setOpen] = useState<boolean>(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);
  const addButton = useRef<HTMLButtonElement | null>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleClose = (e: React.SyntheticEvent<EventTarget>) => {
    if (anchorEl.current!.contains(e.target as HTMLDivElement)) {
      return;
    }

    setOpen(false);
  };

  const addNewItem = (e: React.MouseEvent) => {
    e.stopPropagation();

    const clonedFormStructure = getClonedFormStructure();

    const targetNode = clonedFormStructure.getNode(question['@id']);

    if (!targetNode) {
      console.warn('Missing targetNode', targetNode);
      return;
    }

    customiseQuestion({
      customisingQuestion: { ...NEW_QUESTION },
      onSave: (): OnSaveQuestionsCallback => (questions) => addNewNodes(questions, targetNode, clonedFormStructure),
      onCancel: () => () => addButton.current?.classList.remove(classes.addButtonHighlight),
      onInit: () => addButton.current?.classList.add(classes.addButtonHighlight),
      isNewQuestion: true
    });
  };

  const handleDelete = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();
    handleClose(e);

    const clonedFormStructure = getClonedFormStructure();

    const clonedQuestion = clonedFormStructure.getNode(question['@id']);

    if (!clonedQuestion) {
      console.warn('Question with id not found', question['@id']);
      return;
    }

    const questionParent = clonedQuestion.parent;

    if (!questionParent) {
      console.warn('questionParent does not exist');
      return;
    }

    const index = removeFromSubquestions(questionParent, clonedQuestion);

    removeFromFormStructure(clonedFormStructure, clonedQuestion);

    const potentialFollowingQuestion = questionParent?.data[Constants.HAS_SUBQUESTION]![index];

    if (potentialFollowingQuestion && potentialFollowingQuestion[Constants.HAS_PRECEDING_QUESTION] && clonedQuestion) {
      potentialFollowingQuestion[Constants.HAS_PRECEDING_QUESTION] =
        clonedQuestion.data[Constants.HAS_PRECEDING_QUESTION];
    }

    questionParent.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      questionParent.data[Constants.HAS_SUBQUESTION]
    );

    setFormStructure(clonedFormStructure);
  };

  const handleViewInPreview = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();

    updateSFormsConfig({ startingQuestionId: question['@id'] });
    setActiveStep(activeStep + 1);
  };

  return (
    <span>
      <SquaredIconButton ref={addButton} onClick={addNewItem} title="Add new unordered subquestion">
        <AddIcon />
      </SquaredIconButton>
      {/* @ts-ignore */}
      <SquaredIconButton ref={anchorEl} onClick={handleToggle} title="Show more">
        <MoreVert />
      </SquaredIconButton>
      <Popper open={open} anchorEl={anchorEl.current} transition={true} disablePortal={true} className={classes.menu}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem onClick={handleViewInPreview}>View in preview</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete question</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </span>
  );
};

export default ItemMenu;

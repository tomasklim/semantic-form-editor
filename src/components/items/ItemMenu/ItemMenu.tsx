import React, { FC, useContext, useRef, useState } from 'react';
import { MoreVert } from '@material-ui/icons';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { Constants } from 's-forms';
import {
  getUniqueId,
  highlightQuestion,
  removeFromFormStructure,
  removeFromSubquestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '@utils/index';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import AddIcon from '@material-ui/icons/Add';
import SquaredIconButton from '@styles/SquaredIconButton';
import { CustomiseQuestion, OnSaveQuestionsCallback } from '@contexts/CustomiseQuestionContext';
import useStyles from './ItemMenu.styles';
import { NEW_QUESTION } from '@constants/index';
import { EditorContext } from '@contexts/EditorContext';
import { cloneDeep } from 'lodash';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';
import FormStructureNode from '@model/FormStructureNode';
import { NavigationContext } from '@contexts/NavigationContext';
import { useSnackbar } from 'notistack';

interface Props {
  question: FormStructureQuestion;
  customiseQuestion: CustomiseQuestion;
  onItemClick: (e: React.MouseEvent) => void;
}

const ItemMenu: FC<Props> = ({ question, customiseQuestion, onItemClick }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { formStructure, updateFormStructure, addNewNodes } = useContext(FormStructureContext);
  const { updateSFormsConfig, intl } = useContext(EditorContext);
  const { activeStep, setActiveStep } = useContext(NavigationContext);

  const [open, setOpen] = useState<boolean>(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);
  const addButton = useRef<HTMLButtonElement | null>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleClose = (e?: React.SyntheticEvent<EventTarget>) => {
    if (e && anchorEl.current!.contains(e.target as HTMLDivElement)) {
      return;
    }

    setOpen(false);
  };

  const addNewItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose(e);

    const targetNode = formStructure.getNode(question['@id']);

    if (!targetNode) {
      console.warn('Missing targetNode', targetNode);
      return;
    }

    customiseQuestion({
      customisingQuestion: { ...NEW_QUESTION },
      onSave: (): OnSaveQuestionsCallback => (questions) => addNewNodes(questions, targetNode, intl),
      onCancel: () => () => addButton.current?.classList.remove(classes.addButtonHighlight),
      onInit: () => addButton.current?.classList.add(classes.addButtonHighlight),
      isNewQuestion: true
    });
  };

  const handleDelete = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();
    handleClose(e);

    const clonedQuestion = formStructure.getNode(question['@id']);

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

    removeFromFormStructure(formStructure, clonedQuestion);

    const potentialFollowingQuestion = questionParent?.data[Constants.HAS_SUBQUESTION]![index];

    if (potentialFollowingQuestion && potentialFollowingQuestion[Constants.HAS_PRECEDING_QUESTION] && clonedQuestion) {
      potentialFollowingQuestion[Constants.HAS_PRECEDING_QUESTION] =
        clonedQuestion.data[Constants.HAS_PRECEDING_QUESTION];
    }

    questionParent.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      questionParent.data[Constants.HAS_SUBQUESTION],
      intl
    );

    updateFormStructure(formStructure);

    enqueueSnackbar(`Question with id "${clonedQuestion.data['@id']}" has been deleted!`, {
      variant: 'success'
    });
  };

  const handleDuplicateQuestion = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();
    handleClose(e);

    const clonedQuestion = formStructure.getNode(question['@id']);

    if (!clonedQuestion) {
      console.warn('Question with id not found', question['@id']);
      return;
    }

    const questionParent = clonedQuestion.parent;

    if (!questionParent) {
      console.warn('Parent of question with id not found', question['@id']);
      return;
    }

    const duplicateQuestion = (duplicatedQuestion: FormStructureQuestion, nodeParent: FormStructureNode) => {
      const label = JsonLdUtils.getLocalized(duplicatedQuestion[Constants.RDFS_LABEL], intl);
      duplicatedQuestion['@id'] = getUniqueId(label, formStructure);

      const duplicatedQuestionNode = new FormStructureNode(nodeParent, duplicatedQuestion);

      formStructure.addNode(duplicatedQuestionNode);

      removePrecedingQuestion(duplicatedQuestionNode);

      const subquestions = duplicatedQuestion[Constants.HAS_SUBQUESTION];

      if (subquestions) {
        subquestions.forEach((subquestion: FormStructureQuestion) =>
          duplicateQuestion(subquestion, duplicatedQuestionNode)
        );
      }

      highlightQuestion(duplicatedQuestion['@id']);
    };

    const duplicatedQuestion = cloneDeep(clonedQuestion.data);

    duplicateQuestion(duplicatedQuestion, questionParent);

    questionParent.data[Constants.HAS_SUBQUESTION]!.push(duplicatedQuestion);

    questionParent.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      questionParent.data[Constants.HAS_SUBQUESTION],
      intl
    );

    updateFormStructure(formStructure);
    enqueueSnackbar(`Question have been duplicated!`, {
      variant: 'success'
    });
  };

  const handleViewInPreview = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();

    updateSFormsConfig({ startingQuestionId: question['@id'] });
    setActiveStep(activeStep + 1);
  };

  const removePrecedingQuestionLink = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();
    handleClose();

    const clonedNode = formStructure.getNode(question['@id']);
    const nodeParent = clonedNode?.parent;

    if (!clonedNode || !nodeParent) {
      return;
    }

    removePrecedingQuestion(clonedNode);

    sortRelatedQuestions(nodeParent.data[Constants.HAS_SUBQUESTION], intl);

    updateFormStructure(formStructure);

    highlightQuestion(question['@id']);

    enqueueSnackbar(`Preceding question of question with id "${clonedNode.data['@id']}" has been deleted!`, {
      variant: 'success'
    });
  };

  return (
    <span>
      <SquaredIconButton
        ref={addButton}
        onClick={addNewItem}
        title="Add new unordered subquestion"
        data-testid="add-subquestion-unordered"
      >
        <AddIcon />
      </SquaredIconButton>
      {/* @ts-ignore */}
      <SquaredIconButton ref={anchorEl} onClick={handleToggle} title="Show more" data-testid="menu-header">
        <MoreVert />
      </SquaredIconButton>
      <Popper open={open} anchorEl={anchorEl.current} transition={true} disablePortal={true} className={classes.menu}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="menu-list">
                  <MenuItem onClick={onItemClick}>Edit question</MenuItem>
                  <MenuItem onClick={handleDuplicateQuestion}>Duplicate question</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete question</MenuItem>
                  <MenuItem onClick={addNewItem}>Add a subquestion</MenuItem>
                  {question[Constants.HAS_PRECEDING_QUESTION] && (
                    <MenuItem onClick={removePrecedingQuestionLink} id="menu-item-preceding-question">
                      Remove preceding question link
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleViewInPreview}>View in preview</MenuItem>
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

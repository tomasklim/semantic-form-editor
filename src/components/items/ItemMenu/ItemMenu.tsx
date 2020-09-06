import React, { FC, useContext, useRef, useState } from 'react';
import { ArrowDownward, ArrowUpward, MoreVert } from '@material-ui/icons';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { Constants } from 's-forms';
import {
  highlightQuestion,
  moveQuestion,
  removeFromFormStructure,
  removeFromSubQuestions,
  sortRelatedQuestions
} from '@utils/formBuilder';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import AddIcon from '@material-ui/icons/Add';
import { DIRECTION } from '@enums/index';
import SquaredIconButton from '@styles/SquaredIconButton';
import { CustomiseItemContext, OnSaveCallback } from '@contexts/CustomiseItemContext';
import useStyles from './ItemMenu.styles';
import { NEW_ITEM } from '../../../constants';

interface Props {
  question: FormStructureQuestion;
  movePage?: (id: string, direction: DIRECTION) => void;
}

const ItemMenu: FC<Props> = ({ question, movePage }) => {
  const classes = useStyles();

  const { getClonedFormStructure, setFormStructure, addNewNode } = useContext(FormStructureContext);
  const { customiseItemData } = useContext(CustomiseItemContext);

  const [open, setOpen] = useState<boolean>(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);
  const addButton = useRef<HTMLButtonElement | null>(null);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (e: React.SyntheticEvent<EventTarget>) => {
    if (anchorEl.current!.contains(e.target as HTMLDivElement)) {
      return;
    }

    setOpen(false);
  };

  const addNewItem = (targetId: string) => {
    const clonedFormStructure = getClonedFormStructure();

    const targetNode = clonedFormStructure.getNode(targetId);

    if (!targetNode) {
      console.error('Missing targetNode');
      return;
    }

    customiseItemData(
      NEW_ITEM,
      (): OnSaveCallback => (itemData) => addNewNode(itemData, targetNode, clonedFormStructure),
      () => () => addButton.current?.classList.remove(classes.addButtonHighlight),
      () => addButton.current?.classList.add(classes.addButtonHighlight)
    );
  };

  const handleDelete = (e: React.SyntheticEvent<EventTarget>) => {
    handleClose(e);

    const clonedFormStructure = getClonedFormStructure();

    const q = clonedFormStructure.getNode(question['@id']);

    if (!q) {
      console.warn('Question with id not found', question['@id']);
      return;
    }

    const questionParent = q.parent;

    if (!questionParent) {
      console.warn('questionParent does not exist');
      return;
    }

    const index = removeFromSubQuestions(questionParent, q);

    removeFromFormStructure(clonedFormStructure, q);

    const potentialFollowingQuestion = questionParent?.data[Constants.HAS_SUBQUESTION]![index];

    if (potentialFollowingQuestion && potentialFollowingQuestion[Constants.HAS_PRECEDING_QUESTION] && q) {
      potentialFollowingQuestion[Constants.HAS_PRECEDING_QUESTION] = q.data[Constants.HAS_PRECEDING_QUESTION];
    }

    questionParent.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      questionParent.data[Constants.HAS_SUBQUESTION]
    );

    setFormStructure(clonedFormStructure);
  };

  return (
    <span>
      {movePage && (
        <>
          <SquaredIconButton onClick={() => movePage(question['@id'], DIRECTION.UP)} title="Move page up">
            <ArrowUpward />
          </SquaredIconButton>
          <SquaredIconButton onClick={() => movePage(question['@id'], DIRECTION.DOWN)} title="Move page down">
            <ArrowDownward />
          </SquaredIconButton>
        </>
      )}
      <SquaredIconButton ref={addButton} onClick={() => addNewItem(question['@id'])} title="Add new subquestion">
        <AddIcon />
      </SquaredIconButton>
      {/* @ts-ignore */}
      <SquaredIconButton ref={anchorEl} onClick={handleToggle} title="Show more">
        <MoreVert />
      </SquaredIconButton>
      <Popper open={open} anchorEl={anchorEl.current} transition={true} disablePortal={true}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
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

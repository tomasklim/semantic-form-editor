import React, { FC, useContext, useRef, useState } from 'react';
import { MoreVert } from '@material-ui/icons';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { Constants } from 's-forms';
import { removeFromFormStructure, removeFromSubQuestions, sortRelatedQuestions } from '@utils/index';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import AddIcon from '@material-ui/icons/Add';
import SquaredIconButton from '@styles/SquaredIconButton';
import { CustomiseItemContext, OnSaveCallback } from '@contexts/CustomiseItemContext';
import useStyles from './ItemMenu.styles';
import { NEW_ITEM } from '../../../constants';

interface Props {
  question: FormStructureQuestion;
}

const ItemMenu: FC<Props> = ({ question }) => {
  const classes = useStyles();

  const { getClonedFormStructure, setFormStructure, addNewNode } = useContext(FormStructureContext);
  const { customiseItemData } = useContext(CustomiseItemContext);

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
      console.error('Missing targetNode');
      return;
    }

    customiseItemData({
      itemData: NEW_ITEM,
      onSave: (): OnSaveCallback => (itemData) => addNewNode(itemData, targetNode, clonedFormStructure),
      onCancel: () => () => addButton.current?.classList.remove(classes.addButtonHighlight),
      onInit: () => addButton.current?.classList.add(classes.addButtonHighlight),
      isNew: true
    });
  };

  const handleDelete = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();
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
      <SquaredIconButton ref={addButton} onClick={addNewItem} title="Add new subquestion">
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

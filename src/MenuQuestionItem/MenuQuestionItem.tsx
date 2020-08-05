import React, { FC, useContext, useRef, useState } from 'react';
import { MoreVert } from '@material-ui/icons';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import ENode, { ENodeData } from '../model/ENode';
import { Constants, FormUtils } from 's-forms';
import { removeFromFormStructure, removeFromSubQuestions, sortRelatedQuestions } from '../utils/formBuilder';
import { FormStructureContext } from '../contexts/FormStructureContext';

interface Props {
  question: ENodeData;
}

const MenuQuestionItem: FC<Props> = ({ question }) => {
  const { getClonedFormStructure, setFormStructure } = useContext(FormStructureContext);

  const [open, setOpen] = useState<boolean>(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (e: React.SyntheticEvent<EventTarget>) => {
    if (anchorEl.current!.contains(e.target as HTMLDivElement)) {
      return;
    }

    setOpen(false);
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

  const handleAddSubQuestion = (e: React.SyntheticEvent<EventTarget>) => {
    handleClose(e);

    const clonedFormStructure = getClonedFormStructure();

    const q = clonedFormStructure.getNode(question['@id']);

    if (!q) {
      console.warn('Question with id not found', question['@id']);
      return;
    }

    const id = Math.floor(Math.random() * 10000) + 'subquestion';

    // temporary
    const newQuestion = {
      '@id': id,
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      [Constants.HAS_LAYOUT_CLASS]: ['new'],
      [Constants.RDFS_LABEL]: id,
      [Constants.HAS_SUBQUESTION]: []
    };

    q.data[Constants.HAS_SUBQUESTION] = [newQuestion];

    const node = new ENode(q, newQuestion);

    clonedFormStructure.addNode(newQuestion['@id'], node);

    setFormStructure(clonedFormStructure);
  };

  return (
    <span>
      <span ref={anchorEl} onClick={handleToggle}>
        <MoreVert onClick={handleToggle} />
      </span>
      <Popper open={open} anchorEl={anchorEl.current} transition={true} disablePortal={true}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  {!question[Constants.HAS_SUBQUESTION]?.length && !FormUtils.isWizardStep(question) && (
                    <MenuItem onClick={handleAddSubQuestion}>Add SubQuestion</MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </span>
  );
};

export default MenuQuestionItem;

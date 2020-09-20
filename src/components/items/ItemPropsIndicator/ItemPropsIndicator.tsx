import useStyles from './ItemPropsIndicator.styles';
import { Badge, Tooltip } from '@material-ui/core';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import React, { FC } from 'react';
import { Constants } from 's-forms';
import { ExpandMore } from '@material-ui/icons';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import CommentIcon from '@material-ui/icons/Comment';
import { highlightQuestion } from '@utils/itemHelpers';

type Props = {
  question: FormStructureQuestion;
};

const ItemPropsIndicator: FC<Props> = ({ question }) => {
  const classes = useStyles();

  const handlePrecedingQuestionBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    highlightQuestion(question[Constants.HAS_PRECEDING_QUESTION]!['@id']);
  };

  return (
    <span className={classes.headerIndicators}>
      {question[Constants.REQUIRES_ANSWER] && (
        <div>
          <Tooltip title="Required" arrow>
            <Badge badgeContent="*" className={classes.required} />
          </Tooltip>
        </div>
      )}
      {question[Constants.HAS_PRECEDING_QUESTION] && (
        <div onClick={handlePrecedingQuestionBadgeClick}>
          <Tooltip title="Has preceding question" arrow>
            <Badge badgeContent={<VerticalAlignTopIcon fontSize="small" />} className={classes.preceding} />
          </Tooltip>
        </div>
      )}
      {question[Constants.LAYOUT_CLASS] && question[Constants.LAYOUT_CLASS].includes(Constants.LAYOUT.COLLAPSED) && (
        <div>
          <Tooltip title="Collapsable" arrow>
            <Badge badgeContent={<ExpandMore fontSize="small" />} className={classes.collapsable} />
          </Tooltip>
        </div>
      )}
      {question[Constants.HELP_DESCRIPTION] && (
        <div>
          <Tooltip title="Help description" arrow>
            <Badge badgeContent="?" className={classes.helpDescription} />
          </Tooltip>
        </div>
      )}
      {question[Constants.RDFS_COMMENT] && (
        <div>
          <Tooltip title={question[Constants.RDFS_COMMENT] || ''} arrow>
            <Badge badgeContent={<CommentIcon fontSize="small" />} className={classes.comment} />
          </Tooltip>
        </div>
      )}
    </span>
  );
};

export default ItemPropsIndicator;

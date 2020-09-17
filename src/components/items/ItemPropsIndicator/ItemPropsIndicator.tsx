import useStyles from './ItemPropsIndicator.styles';
import { Badge, Tooltip } from '@material-ui/core';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import React, { FC } from 'react';
import { Constants } from 's-forms';
import { ExpandMore, StarBorder } from '@material-ui/icons';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
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
            <Badge badgeContent={<StarBorder fontSize="small" />} className={classes.required} />
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
    </span>
  );
};

export default ItemPropsIndicator;

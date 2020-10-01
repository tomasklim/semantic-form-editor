import useStyles from './ItemPropsIndicator.styles';
import { Badge, Tooltip } from '@material-ui/core';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import React, { FC, useContext } from 'react';
import { Constants } from 's-forms';
import { Block, ExpandMore } from '@material-ui/icons';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import CommentIcon from '@material-ui/icons/Comment';
import { highlightQuestion } from '@utils/itemHelpers';
import { EditorContext } from '@contexts/EditorContext';

type Props = {
  question: FormStructureQuestion;
};

const ItemPropsIndicator: FC<Props> = ({ question }) => {
  const classes = useStyles();

  const { updateSFormsConfig, activeStep, setActiveStep } = useContext(EditorContext);

  const handlePrecedingQuestionBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    highlightQuestion(question[Constants.HAS_PRECEDING_QUESTION]!['@id']);
  };

  const handleViewInPreview = (e: React.MouseEvent) => {
    e.stopPropagation();

    updateSFormsConfig({ startingQuestionId: question['@id'] });
    setActiveStep(activeStep + 1);
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
          <Tooltip title="Collapsed" arrow>
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
        <div onClick={handleViewInPreview}>
          <Tooltip title={question[Constants.RDFS_COMMENT] || ''} arrow>
            <Badge badgeContent={<CommentIcon fontSize="small" />} className={classes.comment} />
          </Tooltip>
        </div>
      )}
      {question[Constants.INPUT_MASK] && (
        <div>
          <Tooltip title={question[Constants.INPUT_MASK] || ''} arrow>
            <Badge badgeContent={'M'} className={classes.inputMask} />
          </Tooltip>
        </div>
      )}
      {question[Constants.LAYOUT_CLASS] && question[Constants.LAYOUT_CLASS].includes(Constants.LAYOUT.DISABLED) && (
        <div>
          <Tooltip title={'Disabled'} arrow>
            <Badge badgeContent={<Block fontSize={'small'} />} className={classes.disabled} />
          </Tooltip>
        </div>
      )}
      {question[Constants.HAS_OPTIONS_QUERY] && (
        <div>
          <Tooltip title={question[Constants.HAS_OPTIONS_QUERY] || ''} arrow>
            <Badge badgeContent={'Q'} className={classes.optionsQuery} />
          </Tooltip>
        </div>
      )}
    </span>
  );
};

export default ItemPropsIndicator;

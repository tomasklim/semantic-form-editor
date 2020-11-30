import useStyles from './ItemPropsIndicator.styles';
import { Badge, Tooltip } from '@material-ui/core';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import React, { FC, useContext } from 'react';
import { Constants } from 's-forms';
import { Block, ExpandMore, Warning, VisibilityOff } from '@material-ui/icons';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import CommentIcon from '@material-ui/icons/Comment';
import { highlightQuestion } from '@utils/itemHelpers';
import { EditorContext } from '@contexts/EditorContext';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';
import { NavigationContext } from '@contexts/NavigationContext';
import { ValidationContext, ValidationError } from '@contexts/ValidationContext';

type Props = {
  question: FormStructureQuestion;
};

const ItemPropsIndicator: FC<Props> = ({ question }) => {
  const classes = useStyles();

  const { updateSFormsConfig } = useContext(EditorContext);
  const { activeStep, setActiveStep } = useContext(NavigationContext);
  const { questionErrors, isValid } = useContext(ValidationContext);

  const handlePrecedingQuestionBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    highlightQuestion(question[Constants.HAS_PRECEDING_QUESTION]['@id']);
  };

  const handleViewInPreview = (e: React.MouseEvent) => {
    e.stopPropagation();

    updateSFormsConfig({ startingQuestionId: question['@id'] });
    setActiveStep(activeStep + 1);
  };

  const errors: ValidationError = questionErrors.get(question['@id']);

  const getErrorText = () => {
    return (
      <>
        {errors.map((error) => (
          <div>
            {error.attribute}&nbsp;:&nbsp;{error.error}
          </div>
        ))}
      </>
    );
  };

  return (
    <span className={classes.headerIndicators}>
      {isValid === false && errors && (
        <div className={classes.validationErrors} data-testid="invalid-indicator">
          <Tooltip title={getErrorText()} PopperProps={{ className: classes.tooltipNowrap }}>
            <Warning />
          </Tooltip>
        </div>
      )}
      {question[Constants.REQUIRES_ANSWER] && (
        <div data-testid="required-indicator">
          <Tooltip title="Required" arrow>
            <Badge badgeContent="*" className={classes.required} />
          </Tooltip>
        </div>
      )}
      {question[Constants.HAS_PRECEDING_QUESTION] && (
        <div onClick={handlePrecedingQuestionBadgeClick} data-testid={'preceding-question-indicator'}>
          <Tooltip title="Has preceding question" arrow>
            <Badge badgeContent={<VerticalAlignTopIcon fontSize="small" />} className={classes.preceding} />
          </Tooltip>
        </div>
      )}
      {question[Constants.LAYOUT_CLASS] && question[Constants.LAYOUT_CLASS].includes(Constants.LAYOUT.COLLAPSED) && (
        <div data-testid="collapsed-indicator">
          <Tooltip title="Collapsed" arrow>
            <Badge badgeContent={<ExpandMore fontSize="small" />} className={classes.collapsable} />
          </Tooltip>
        </div>
      )}
      {question[Constants.HELP_DESCRIPTION] && (
        <div data-testid="help-indicator">
          <Tooltip title="Question help" arrow>
            <Badge badgeContent="?" className={classes.helpDescription} />
          </Tooltip>
        </div>
      )}
      {question[Constants.RDFS_COMMENT] && (
        <div onClick={handleViewInPreview} data-testid={'comment-indicator'}>
          <Tooltip title={JsonLdUtils.getLocalized(question[Constants.RDFS_COMMENT], {}) || ''} arrow>
            <Badge badgeContent={<CommentIcon fontSize="small" />} className={classes.comment} />
          </Tooltip>
        </div>
      )}
      {question[Constants.LAYOUT_CLASS] && question[Constants.LAYOUT_CLASS].includes(Constants.LAYOUT.DISABLED) && (
        <div data-testid="disabled-indicator">
          <Tooltip title={'Disabled'} arrow>
            <Badge badgeContent={<Block fontSize={'small'} />} className={classes.disabled} />
          </Tooltip>
        </div>
      )}
      {question[Constants.LAYOUT_CLASS] && question[Constants.LAYOUT_CLASS].includes(Constants.LAYOUT.HIDDEN) && (
        <div data-testid="hidden-indicator">
          <Tooltip title={'Hidden'} arrow>
            <Badge badgeContent={<VisibilityOff fontSize={'small'} />} className={classes.hidden} />
          </Tooltip>
        </div>
      )}
    </span>
  );
};

export default ItemPropsIndicator;

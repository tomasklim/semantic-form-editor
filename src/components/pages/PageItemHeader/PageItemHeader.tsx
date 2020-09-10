import { AccordionSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import React, { FC } from 'react';
import useStyles from './PageItemHeader.styles';
import { DIRECTION } from '@enums/index';
import ItemMenu from '@components/items/ItemMenu/ItemMenu';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import ItemPropsIndicator from '@components/items/ItemPropsIndicator/ItemPropsIndicator';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

type Props = {
  question: FormStructureQuestion;
  movePage: (e: React.MouseEvent, id: string, direction: DIRECTION) => void;
  position: number;
  expanded: boolean;
  expandPage: (e: React.MouseEvent) => void;
};

const PageItemHeader: FC<Props> = ({ question, movePage, position, expandPage, expanded }) => {
  const classes = useStyles();

  return (
    <AccordionSummary className={classes.header}>
      <div className={classes.wizardHeaderContainer}>
        <div className={`${classes.wizardHeaderItem} ${classes.wizardHeaderLeft}`}>
          {expanded ? <ExpandLess onClick={expandPage} /> : <ExpandMore onClick={expandPage} />}
          <Typography>
            {position}
            {'. '}
            {question[Constants.RDFS_LABEL] || question['@id']}
          </Typography>
          <ItemPropsIndicator question={question} />
        </div>
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderRight}`}>
          <ItemMenu question={question} movePage={movePage} />
        </span>
      </div>
    </AccordionSummary>
  );
};

export default PageItemHeader;

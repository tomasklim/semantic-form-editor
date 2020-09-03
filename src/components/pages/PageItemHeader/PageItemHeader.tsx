import { AccordionSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import React, { FC } from 'react';
import useStyles from './PageItemHeader.styles';
import { DIRECTION } from '@enums/index';
import ItemMenu from '@components/items/ItemMenu/ItemMenu';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import ItemPropsIndicator from '@components/items/ItemPropsIndicator/ItemPropsIndicator';

type Props = {
  question: FormStructureQuestion;
  movePage: (id: string, direction: DIRECTION) => void;
  position: number;
};

const PageItemHeader: FC<Props> = ({ question, movePage, position }) => {
  const classes = useStyles();

  return (
    <AccordionSummary
      className={classes.header}
      // expandIcon={<ExpandMoreIcon />}
    >
      <div className={classes.wizardHeaderContainer}>
        <div className={`${classes.wizardHeaderItem} ${classes.wizardHeaderLeft}`}>
          <Typography>
            {position}
            {'. '}
            {question[Constants.RDFS_LABEL] || question['@id']}
          </Typography>
          <ItemPropsIndicator question={question} />
        </div>
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderCenter}`} />
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderRight}`}>
          <ItemMenu question={question} movePage={movePage} />
        </span>
      </div>
    </AccordionSummary>
  );
};

export default PageItemHeader;

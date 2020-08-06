import { AccordionSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import React, { FC } from 'react';
import useStyles from './WizardHeader.styles';
import { DIRECTION } from '../../enums';
import MenuQuestionItem from '../../MenuQuestionItem/MenuQuestionItem';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';

type Props = {
  question: FormStructureQuestion;
  movePage: (id: string, direction: DIRECTION) => void;
  position: number;
};

const WizardHeader: FC<Props> = ({ question, movePage, position }) => {
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
            {question[Constants.RDFS_LABEL] || question['@id']} {question[Constants.HAS_PRECEDING_QUESTION] && '^'}
          </Typography>
        </div>
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderCenter}`} />
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderRight}`}>
          <MenuQuestionItem question={question} movePage={movePage} />
        </span>
      </div>
    </AccordionSummary>
  );
};

export default WizardHeader;

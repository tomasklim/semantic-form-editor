import { AccordionSummary, Box, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { MoreVert, ArrowUpward, ArrowDownward } from '@material-ui/icons';
import React, { FC } from 'react';
import useStyles from './WizardHeader.styles';
import { ENodeData } from '../../model/ENode';

type Props = {
  question: ENodeData;
  addNewQuestion: (targetId: string) => void;
};

const WizardHeader: FC<Props> = ({ addNewQuestion, question }) => {
  const classes = useStyles();

  return (
    <AccordionSummary
      className={classes.header}
      // expandIcon={<ExpandMoreIcon />}
    >
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
        <div className={`${classes.wizardHeaderItem} ${classes.wizardHeaderLeft}`}>
          <Typography>
            {question[Constants.RDFS_LABEL] || question['@id']} {question[Constants.HAS_PRECEDING_QUESTION] && '^'}
          </Typography>
          <AddCircleIcon fontSize={'large'} onClick={() => addNewQuestion(question['@id'])} />
        </div>
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderCenter}`} />
        <span className={`${classes.wizardHeaderItem} ${classes.wizardHeaderRight}`}>
          <ArrowUpward />
          <ArrowDownward />
          <MoreVert />
        </span>
      </Box>
    </AccordionSummary>
  );
};

export default WizardHeader;

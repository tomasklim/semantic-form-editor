import { AccordionSummary, Box, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import React, { Dispatch, FC, SetStateAction } from 'react';
import useStyles from './WizardHeader.styles';
import { ENodeData } from '../../model/ENode';
import { DIRECTION } from '../../enums';
import MenuQuestionItem from '../../MenuQuestionItem/MenuQuestionItem';
import ETree from '../../model/ETree';

type Props = {
  question: ENodeData;
  addNewQuestion: (targetId: string) => void;
  movePage: (id: string, direction: DIRECTION) => void;
  formStructure: ETree;
  setFormStructure: Dispatch<SetStateAction<ETree | undefined>>;
};

const WizardHeader: FC<Props> = ({ addNewQuestion, question, movePage, formStructure, setFormStructure }) => {
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
          <ArrowUpward onClick={() => movePage(question['@id'], DIRECTION.UP)} />
          <ArrowDownward onClick={() => movePage(question['@id'], DIRECTION.DOWN)} />
          <MenuQuestionItem formStructure={formStructure} setFormStructure={setFormStructure} question={question} />
        </span>
      </Box>
    </AccordionSummary>
  );
};

export default WizardHeader;

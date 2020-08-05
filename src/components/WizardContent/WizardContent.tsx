import { Constants } from 's-forms';
import EditorAdd from '@components/EditorAdd/EditorAdd';
import { AccordionDetails } from '@material-ui/core';
import React, { FC } from 'react';
import useStyles from './WizardContent.styles';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';

interface Props {
  question: FormStructureQuestion;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
}

const WizardContent: FC<Props> = ({ question, buildFormUI }) => {
  const classes = useStyles();

  return (
    <AccordionDetails className={classes.body}>
      <ol id={question['@id']}>
        {question[Constants.HAS_SUBQUESTION]!.length > 0 && <EditorAdd parentId={question['@id']} position={0} />}
        {question[Constants.HAS_SUBQUESTION]!.map((q, index) => buildFormUI(q, index + 1, question))}
      </ol>
    </AccordionDetails>
  );
};

export default WizardContent;

import { Constants } from 's-forms';
import EditorAdd from '@components/EditorAdd/EditorAdd';
import { AccordionDetails } from '@material-ui/core';
import React, { FC } from 'react';
import useStyles from './WizardContent.styles';
import { ENodeData } from '../../model/ENode';

interface Props {
  question: ENodeData;
  buildFormUI: (question: ENodeData, position: number, parentQuestion: ENodeData) => JSX.Element;
}

const WizardContent: FC<Props> = ({ question, buildFormUI }) => {
  const classes = useStyles();

  return (
    <AccordionDetails className={classes.body}>
      <ol id={question['@id']}>
        {question[Constants.HAS_SUBQUESTION]!.length > 0 && <EditorAdd parentId={question['@id']} position={0} />}
        {question[Constants.HAS_SUBQUESTION] &&
          question[Constants.HAS_SUBQUESTION]!.map((q, index) => buildFormUI(q, index + 1, question))}
      </ol>
    </AccordionDetails>
  );
};

export default WizardContent;

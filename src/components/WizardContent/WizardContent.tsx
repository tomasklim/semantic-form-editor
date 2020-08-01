import { Constants } from 's-forms';
import EditorAdd from '@components/EditorAdd/EditorAdd';
import { AccordionDetails } from '@material-ui/core';
import React, { Dispatch, FC, SetStateAction } from 'react';
import useStyles from './WizardContent.styles';
import { ENodeData } from '../../model/ENode';
import ETree from '../../model/ETree';

interface Props {
  question: ENodeData;
  buildFormUI: (question: ENodeData, position: number, parentQuestion: ENodeData) => JSX.Element;
  formStructure: ETree;
  setFormStructure: Dispatch<SetStateAction<ETree | undefined>>;
}

const WizardContent: FC<Props> = ({ question, formStructure, setFormStructure, buildFormUI }) => {
  const classes = useStyles();

  return (
    <AccordionDetails className={classes.body}>
      <ol id={question['@id']}>
        {question[Constants.HAS_SUBQUESTION]!.length > 0 && (
          <EditorAdd
            parentId={question['@id']}
            position={0}
            formStructure={formStructure}
            setFormStructure={setFormStructure}
          />
        )}
        {question[Constants.HAS_SUBQUESTION] &&
          question[Constants.HAS_SUBQUESTION]!.map((q, index) => buildFormUI(q, index + 1, question))}
      </ol>
    </AccordionDetails>
  );
};

export default WizardContent;

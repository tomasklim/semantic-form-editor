import { Constants } from 's-forms';
import ItemAdd from '@components/items/AddItem/AddItem';
import { AccordionDetails } from '@material-ui/core';
import React, { FC } from 'react';
import useStyles from './PageItemContent.styles';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface Props {
  question: FormStructureQuestion;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
  handleMouseOver: any;
}

const PageItemContent: FC<Props> = ({ question, buildFormUI, handleMouseOver }) => {
  const classes = useStyles();

  return (
    <AccordionDetails id={question['@id']} className={classes.body} onMouseOver={handleMouseOver}>
      <ol className={classes.ol}>
        {question[Constants.HAS_SUBQUESTION]!.length > 0 && <ItemAdd parentId={question['@id']} position={0} />}
        {question[Constants.HAS_SUBQUESTION]!.map((q, index) => buildFormUI(q, index + 1, question))}
        {!question[Constants.HAS_SUBQUESTION]!.length && <div className={classes.emptyPage}>Empty page...</div>}
      </ol>
    </AccordionDetails>
  );
};

export default PageItemContent;

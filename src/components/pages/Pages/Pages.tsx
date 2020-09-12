import React, { FC } from 'react';
import { Constants } from 's-forms';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import PageItem from '@components/pages/PageItem/PageItem';
import { NEW_PAGE_ITEM } from '../../../constants';

type PagesProps = {
  question: FormStructureQuestion;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
};

const Pages: FC<PagesProps> = ({ question, buildFormUI }) => {
  const relatedQuestions = question[Constants.HAS_SUBQUESTION];

  return (
    <React.Fragment>
      {relatedQuestions &&
        relatedQuestions.map((questionData, index) => (
          <PageItem
            key={questionData['@id']}
            empty={false}
            index={index}
            question={questionData}
            buildFormUI={buildFormUI}
          />
        ))}
      <PageItem key={'empty-page'} empty={true} index={0} question={NEW_PAGE_ITEM} buildFormUI={buildFormUI} />
    </React.Fragment>
  );
};

export default Pages;

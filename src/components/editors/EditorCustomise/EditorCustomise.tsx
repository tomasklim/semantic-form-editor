import React, { useContext } from 'react';
import { Constants, FormUtils } from 's-forms';
import Item from '@components/items/Item/Item';
import ItemAdd from '@components/items/ItemAdd/ItemAdd';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import useStyles from './EditorCustomise.styles';
import ItemSection from '@components/items/ItemSection/ItemSection';
import Sidebar from '@components/sidebars/Sidebar/Sidebar';
import ItemFormEmpty from '@components/items/ItemFormEmpty/ItemFormEmpty';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';

const EditorCustomise: React.FC = () => {
  const classes = useStyles();

  const { formStructure } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);

  const buildFormUI = (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ): JSX.Element => {
    if (!question) {
      console.warn('Question is undefined', parentQuestion, formStructure);
      return <></>;
    }
    const subquestions = question[Constants.HAS_SUBQUESTION];
    const topLevelPosition = FormUtils.isForm(parentQuestion);

    let item = null;

    if (
      FormUtils.isTypeahead(question) ||
      FormUtils.isCalendar(question) ||
      FormUtils.isCheckbox(question) ||
      FormUtils.isMaskedInput(question) ||
      FormUtils.isTextarea(question, '') ||
      !(FormUtils.isSection(question) || FormUtils.isWizardStep(question)) // text field
    ) {
      item = <Item question={question} position={position} customiseQuestion={customiseQuestion} />;
    } else {
      const isWizardStep = FormUtils.isWizardStep(question);

      return (
        <React.Fragment key={question['@id']}>
          {position === 0 && (
            <ItemAdd
              parentQuestionId={parentQuestion['@id']}
              position={position}
              isWizardPosition={isWizardStep}
              topLevelPosition={topLevelPosition}
              customiseQuestion={customiseQuestion}
            />
          )}
          <ItemSection
            question={question}
            buildFormUI={buildFormUI}
            position={position}
            customiseQuestion={customiseQuestion}
          />
          <ItemAdd
            parentQuestionId={parentQuestion['@id']}
            position={position + 1}
            isWizardPosition={isWizardStep}
            customiseQuestion={customiseQuestion}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={question['@id']}>
        {position === 0 && (
          <ItemAdd
            parentQuestionId={parentQuestion['@id']}
            position={position}
            topLevelPosition={topLevelPosition}
            customiseQuestion={customiseQuestion}
          />
        )}
        {item}
        {subquestions && (
          <ol id={question['@id']} className={classes.olPaddingLeft}>
            {subquestions.map((subquestion: FormStructureQuestion, index: number) =>
              buildFormUI(subquestion, index, question)
            )}
          </ol>
        )}
        <ItemAdd
          parentQuestionId={parentQuestion['@id']}
          position={position + 1}
          customiseQuestion={customiseQuestion}
        />
      </React.Fragment>
    );
  };

  const rootSubquestions = formStructure.root.data[Constants.HAS_SUBQUESTION];

  return (
    <div>
      <ol className={classes.form} id="form">
        {!rootSubquestions?.length && <ItemFormEmpty />}

        {rootSubquestions?.map((subquestion: FormStructureQuestion, index: number) =>
          buildFormUI(subquestion, index, formStructure.root.data)
        )}
      </ol>

      <Sidebar />
    </div>
  );
};

export default EditorCustomise;

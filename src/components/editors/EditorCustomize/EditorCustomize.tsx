import React, { FC, useContext } from 'react';
import { Constants, FormUtils } from 's-forms';
import Item from '@components/items/Item/Item';
import ItemAdd from '@components/items/ItemAdd/ItemAdd';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import useStyles from './EditorCustomize.styles';
import ItemSection from '@components/items/ItemSection/ItemSection';
import Sidebar from '@components/sidebars/Sidebar/Sidebar';
import ItemFormEmpty from '@components/items/ItemFormEmpty/ItemFormEmpty';

interface EditorCustomizeProps {}

const EditorCustomize: FC<EditorCustomizeProps> = ({}) => {
  const classes = useStyles();

  const { formStructure } = useContext(FormStructureContext);

  const buildFormUI = (
    questionData: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ): JSX.Element => {
    const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];
    const topLevelQuestion = FormUtils.isForm(parentQuestion);

    let item = null;

    if (FormUtils.isTypeahead(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isCalendar(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isCheckbox(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isMaskedInput(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isTextarea(questionData, '')) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isSection(questionData) || FormUtils.isWizardStep(questionData)) {
      const isWizardStep = FormUtils.isWizardStep(questionData);
      return (
        <React.Fragment key={questionData['@id']}>
          {position === 0 && (
            <ItemAdd
              parentId={parentQuestion['@id']}
              position={0}
              wizard={isWizardStep}
              topLevelQuestion={topLevelQuestion}
            />
          )}
          <ItemSection
            questionData={questionData}
            buildFormUI={buildFormUI}
            position={position}
            topLevelQuestion={topLevelQuestion}
          />
          <ItemAdd parentId={parentQuestion['@id']} position={position + 1} wizard={isWizardStep} />
        </React.Fragment>
      );
    } else {
      // simple text field
      item = <Item questionData={questionData} position={position} />;
    }

    return (
      <React.Fragment key={questionData['@id']}>
        {position === 0 && (
          <ItemAdd parentId={parentQuestion['@id']} position={0} topLevelQuestion={topLevelQuestion} />
        )}
        {item}
        {relatedQuestions && (
          <ol id={questionData['@id']} className={classes.ol}>
            {relatedQuestions!.map((question, index) => buildFormUI(question, index, questionData))}
          </ol>
        )}
        <ItemAdd parentId={parentQuestion['@id']} position={position + 1} />
      </React.Fragment>
    );
  };

  const rootSubquestions = formStructure.root.data[Constants.HAS_SUBQUESTION];

  return (
    <div>
      <ol className={classes.content}>
        {!rootSubquestions?.length && <ItemFormEmpty key={'empty-page'} />}

        {rootSubquestions?.map((question, index) => buildFormUI(question, index, formStructure.root.data))}
      </ol>
      <Sidebar />
    </div>
  );
};

export default EditorCustomize;

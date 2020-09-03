import React, { FC, useContext } from 'react';
import { Constants, FormUtils } from 's-forms';
import Item from '@components/items/Item/Item';
import PageItem from '@components/pages/PageItem/PageItem';
import ItemAdd from '@components/items/AddItem/AddItem';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import useStyles from './EditorCustomize.styles';
import ItemSection from '@components/items/ItemSection/ItemSection';

interface EditorCustomizeProps {}

const EditorCustomize: FC<EditorCustomizeProps> = ({}) => {
  const classes = useStyles();

  const { formStructure } = useContext(FormStructureContext);

  const buildFormUI = (
    questionData: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion | undefined
  ): JSX.Element => {
    const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];
    let item = null;

    if (FormUtils.isForm(questionData)) {
      return <PageItem key={questionData['@id']} question={questionData} buildFormUI={buildFormUI} />;
    } else if (FormUtils.isTypeahead(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isCalendar(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isCheckbox(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isMaskedInput(questionData)) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isTextarea(questionData, '')) {
      item = <Item questionData={questionData} position={position} />;
    } else if (FormUtils.isSection(questionData)) {
      return (
        <React.Fragment key={questionData['@id']}>
          <ItemSection questionData={questionData} buildFormUI={buildFormUI} position={position} />
          <ItemAdd parentId={parentQuestion?.['@id'] || ''} position={position} />
        </React.Fragment>
      );
    } else {
      item = <Item questionData={questionData} position={position} />;
    }

    return (
      <React.Fragment key={questionData['@id']}>
        {item}
        <ol id={questionData['@id']} className={classes.ol}>
          {relatedQuestions && relatedQuestions!.length > 0 && <ItemAdd parentId={questionData['@id']} position={0} />}
          {relatedQuestions &&
            relatedQuestions!.map((question, index) => buildFormUI(question, index + 1, questionData))}
        </ol>
        <ItemAdd
          parentId={parentQuestion?.['@id'] || ''} // empty string for root only
          position={position}
        />
      </React.Fragment>
    );
  };

  return <>{buildFormUI(formStructure.root.data, 1, undefined)}</>;
};

export default EditorCustomize;

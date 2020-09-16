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
    parentQuestion: FormStructureQuestion | undefined
  ): JSX.Element => {
    const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];
    let item = null;

    if (FormUtils.isForm(questionData)) {
      const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];

      if (!relatedQuestions || !relatedQuestions.length) {
        return <ItemFormEmpty key={'empty-page'} />;
      }

      return (
        <React.Fragment>
          <ItemAdd parentId={questionData['@id']} position={0} wizard={true} />
          {relatedQuestions.map((question, index) => (
            <React.Fragment key={question['@id']}>
              <ItemSection questionData={question} buildFormUI={buildFormUI} position={index + 1} />
              <ItemAdd parentId={questionData['@id']} position={index + 1} wizard={true} />
            </React.Fragment>
          ))}
        </React.Fragment>
      );
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
      // simple text field
      item = <Item questionData={questionData} position={position} />;
    }

    return (
      <React.Fragment key={questionData['@id']}>
        {item}
        {relatedQuestions && (
          <ol id={questionData['@id']} className={classes.ol}>
            {relatedQuestions!.length > 0 && <ItemAdd parentId={questionData['@id']} position={0} />}
            {relatedQuestions!.map((question, index) => buildFormUI(question, index + 1, questionData))}
          </ol>
        )}
        <ItemAdd
          parentId={parentQuestion?.['@id'] || ''} // empty string for root only
          position={position}
        />
      </React.Fragment>
    );
  };

  return (
    <div>
      <ol className={classes.content}>{buildFormUI(formStructure.root.data, 1, undefined)}</ol>
      <Sidebar />
    </div>
  );
};

export default EditorCustomize;

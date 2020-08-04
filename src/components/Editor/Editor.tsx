import React, { FC, useContext } from 'react';
import { ENodeData } from '../../model/ENode';
import { Constants, FormUtils } from 's-forms';
import EditorItem from '@components/EditorItem/EditorItem';
import EditorWizard from '@components/EditorWizard/EditorWizard';
import EditorAdd from '@components/EditorAdd/EditorAdd';
import { FormStructureContext } from '../../contexts/FormStructureContext';

type Props = {};

const Editor: FC<Props> = ({}) => {
  const { formStructure } = useContext(FormStructureContext);

  const buildFormUI = (
    questionData: ENodeData,
    position: number,
    parentQuestion: ENodeData | undefined
  ): JSX.Element => {
    const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];
    let item = null;

    if (FormUtils.isForm(questionData)) {
      return <EditorWizard key={questionData['@id']} question={questionData} buildFormUI={buildFormUI} />;
    } else if (FormUtils.isSection(questionData)) {
      item = <EditorItem questionData={questionData} />;
    } else if (FormUtils.isTypeahead(questionData)) {
      item = <EditorItem questionData={questionData} />;
    } else if (FormUtils.isCalendar(questionData)) {
      item = <EditorItem questionData={questionData} />;
    } else if (FormUtils.isCheckbox(questionData)) {
      item = <EditorItem questionData={questionData} />;
    } else if (FormUtils.isMaskedInput(questionData)) {
      item = <EditorItem questionData={questionData} />;
    } else if (FormUtils.isTextarea(questionData, '')) {
      item = <EditorItem questionData={questionData} />;
    } else {
      item = <EditorItem questionData={questionData} />;
    }

    return (
      <React.Fragment key={questionData['@id']}>
        {item}
        <ol id={questionData['@id']}>
          {relatedQuestions && relatedQuestions!.length > 0 && (
            <EditorAdd parentId={questionData['@id']} position={0} />
          )}
          {relatedQuestions &&
            relatedQuestions!.map((question, index) => buildFormUI(question, index + 1, questionData))}
        </ol>
        <EditorAdd
          parentId={parentQuestion?.['@id'] || ''} // empty string for root only
          position={position}
        />
      </React.Fragment>
    );
  };

  return buildFormUI(formStructure.root.data, 1, undefined);
};

export default Editor;

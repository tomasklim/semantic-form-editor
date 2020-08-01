import React, { FC, useEffect, useState } from 'react';
import { buildFormStructure } from '../../utils/formBuilder';
import { ENodeData } from '../../model/ENode';
import { Constants, FormUtils } from 's-forms';
import ETree from '../../model/ETree';
import EditorItem from '@components/EditorItem/EditorItem';
import EditorWizard from '@components/EditorWizard/EditorWizard';
import EditorAdd from '@components/EditorAdd/EditorAdd';

type Props = {};

const Editor: FC<Props> = ({}) => {
  const [formStructure, setFormStructure] = useState<ETree>();

  useEffect(() => {
    async function getFormStructure() {
      const form = require('../../utils/form.json');
      const formStructure = await buildFormStructure(form);

      setFormStructure(formStructure);
    }

    getFormStructure();
  }, []);

  const buildFormUI = (
    questionData: ENodeData,
    position: number,
    parentQuestion: ENodeData | undefined
  ): JSX.Element => {
    const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];
    let item = null;

    if (FormUtils.isForm(questionData)) {
      return (
        <EditorWizard
          key={questionData['@id']}
          question={questionData}
          buildFormUI={buildFormUI}
          formStructure={formStructure!}
          setFormStructure={setFormStructure}
        />
      );
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
            <EditorAdd
              parentId={questionData['@id']}
              position={0}
              formStructure={formStructure}
              setFormStructure={setFormStructure}
            />
          )}
          {relatedQuestions &&
            relatedQuestions!.map((question, index) => buildFormUI(question, index + 1, questionData))}
        </ol>
        <EditorAdd
          parentId={parentQuestion?.['@id'] || ''} // empty string for root only
          position={position}
          formStructure={formStructure!}
          setFormStructure={setFormStructure}
        />
      </React.Fragment>
    );
  };

  if (!formStructure?.root?.data) {
    return null;
  }

  return buildFormUI(formStructure.root.data, 1, undefined);
};

export default Editor;

import React, { FC, useEffect, useState } from 'react';
import { buildFormStructure } from '../../utils/formBuilder';
import { ENodeData } from '../../model/ENode';
import { Constants, FormUtils } from 's-forms';
import ETree from '../../model/ETree';
import EditorItem from '@components/EditorItem/EditorItem';
import EditorWizard from '@components/EditorWizard/EditorWizard';

type Props = {};

const Editor: FC<Props> = ({}) => {
  const [tree, setTree] = useState<ETree | null>(null);

  useEffect(() => {
    async function getTree() {
      const form = require('../../utils/form.json');
      const tree = await buildFormStructure(form);

      setTree(tree);
    }
    getTree();
  }, []);

  const treeList = () => {
    if (!tree) {
      return null;
    }

    const root = tree.root;

    const buildTreeList = (question: ENodeData) => {
      let item = null;

      const relatedQuestions = question[Constants.HAS_SUBQUESTION];

      if (FormUtils.isForm(question)) {
        return (
          <EditorWizard
            key={question['@id']}
            buildTreeList={buildTreeList}
            question={question}
            tree={tree}
            setTree={setTree}
          />
        );
      } else if (FormUtils.isSection(question)) {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      } else if (FormUtils.isTypeahead(question)) {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      } else if (FormUtils.isCalendar(question)) {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      } else if (FormUtils.isCheckbox(question)) {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      } else if (FormUtils.isMaskedInput(question)) {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      } else if (FormUtils.isTextarea(question, '')) {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      } else {
        item = <EditorItem data={question} setTree={setTree} tree={tree} />;
      }

      return (
        <React.Fragment key={question['@id']}>
          {item}
          {relatedQuestions && relatedQuestions.map((q) => <ol key={q['@id']}>{buildTreeList(q)}</ol>)}
        </React.Fragment>
      );
    };

    return buildTreeList(root.data);
  };

  return treeList();
};

export default Editor;

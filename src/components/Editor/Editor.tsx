import React, { FC, useEffect, useState } from 'react';
import { buildFormStructure } from '../../utils/formBuilder';
import { ENodeData } from '../../model/ENode';
import { Constants, FormUtils } from 's-forms';
import ETree from '../../model/ETree';
import EditorItem from '@components/EditorItem/EditorItem';
import EditorWizard from '@components/EditorWizard/EditorWizard';
import useStyles from '../EditorWizard/EditorWizard.styles';
import EditorAdd from '@components/EditorAdd/EditorAdd';

type Props = {};

const Editor: FC<Props> = ({}) => {
  const classes = useStyles();
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

    const buildTreeList = (question: ENodeData, position: number, parentQuestion: ENodeData) => {
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
          {relatedQuestions &&
            relatedQuestions.map((q, index) => (
              <ol key={q['@id']}>
                <EditorAdd parentId={question['@id']} position={0} tree={tree} setTree={setTree} />
                {buildTreeList(q, index + 1, question)}
              </ol>
            ))}
          <EditorAdd parentId={parentQuestion?.['@id']} position={position} tree={tree} setTree={setTree} />
        </React.Fragment>
      );
    };

    return buildTreeList(root.data, 1, null);
  };

  return treeList();
};

export default Editor;

import React, { Dispatch, FC, SetStateAction } from 'react';
import ENode, { ENodeData } from '../../model/ENode';
import { Box, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import useStyles from './EditorWizard.styles';
import { sortRelatedQuestions } from '../../utils/formBuilder';
import ETree from '../../model/ETree';
import { cloneDeep } from 'lodash';
import EditorAdd from '@components/EditorAdd/EditorAdd';

type Props = {
  question: ENodeData;
  buildTreeList: any;
  tree: ETree;
  setTree: Dispatch<SetStateAction<ETree | null>>;
};

const EditorWizard: FC<Props> = ({ question, buildTreeList, tree, setTree }) => {
  const classes = useStyles();

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      e.preventDefault();

      e.dataTransfer.dropEffect = 'move';
    }
    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLDivElement).classList.add(classes.pageOver);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLDivElement).classList.remove(classes.pageOver);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      e.preventDefault();

      (e.target as HTMLLIElement).style.opacity = '1';

      document
        .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
        .forEach((element) => (element.style.pointerEvents = 'all'));

      [].forEach.call(document.getElementsByClassName(classes.page), (page: HTMLDivElement) => {
        page.classList.remove(classes.pageOver);
      });

      if ((e.target as HTMLDivElement).id) {
        const movingNode = tree?.structure.get(e.dataTransfer.types.slice(-1)[0]);
        const page = tree?.structure.get((e.target as HTMLDivElement).id);

        if (!movingNode || !page) {
          return;
        }

        moveNodeToPage(movingNode, page);

        e.dataTransfer.clearData();
      }
    }

    return false;
  };

  const moveNodeToPage = (movingNode: ENode, page: ENode) => {
    const newTree = cloneDeep(tree);

    movingNode = newTree.structure.get(movingNode.data['@id']);
    page = newTree.structure.get(page.data['@id']);

    if (!movingNode?.data || !page?.data) {
      console.warn('Error3');
      return;
    }

    // if node with preceding question is moved, it loses its preceding question
    if (movingNode.data[Constants.HAS_PRECEDING_QUESTION]) {
      delete movingNode.data[Constants.HAS_PRECEDING_QUESTION];
    }

    if (!movingNode?.parent) {
      return;
    }

    const movingNodeParent = movingNode.parent;

    if (!movingNodeParent?.data || !page?.data) {
      console.warn('Error1');
      return;
    }

    // if some node has nodeToMove as a preceding node, it loses it
    movingNodeParent.data[Constants.HAS_SUBQUESTION].forEach((nodeData: ENodeData) => {
      if (
        nodeData[Constants.HAS_PRECEDING_QUESTION] &&
        nodeData[Constants.HAS_PRECEDING_QUESTION]['@id'] === movingNode.data['@id']
      ) {
        delete nodeData[Constants.HAS_PRECEDING_QUESTION];
      }
    });

    if (!movingNodeParent || !page) {
      console.warn('Error2');
      return;
    }

    movingNode.parent = page;

    movingNodeParent.data[Constants.HAS_SUBQUESTION] = movingNodeParent.data[Constants.HAS_SUBQUESTION].filter(
      (node: ENodeData) => node['@id'] !== movingNode.data['@id']
    );

    page.data[Constants.HAS_SUBQUESTION].push(movingNode.data);

    page.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(page.data[Constants.HAS_SUBQUESTION]);

    setTree(newTree);
  };

  const relatedQuestions = question[Constants.HAS_SUBQUESTION];

  return (
    <React.Fragment>
      {relatedQuestions &&
        relatedQuestions.map((q) => (
          <Box
            key={q['@id']}
            id={q['@id']}
            className={classes.page}
            data-droppable={true}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <ExpansionPanel expanded={true} className={classes.panel}>
              <ExpansionPanelSummary
                className={classes.header}
                // expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{q[Constants.RDFS_LABEL]}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.body}>
                <ol id={q['@id']}>
                  {q[Constants.HAS_SUBQUESTION]?.length > 0 && (
                    <EditorAdd parentId={q['@id']} position={0} tree={tree} setTree={setTree} />
                  )}
                  {q[Constants.HAS_SUBQUESTION] &&
                    q[Constants.HAS_SUBQUESTION].map((question, index) => buildTreeList(question, index + 1, q))}
                </ol>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Box>
        ))}
    </React.Fragment>
  );
};

export default EditorWizard;

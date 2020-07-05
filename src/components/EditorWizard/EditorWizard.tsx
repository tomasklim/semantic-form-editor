import React, { Dispatch, FC, SetStateAction } from 'react';
import ENode, { ENodeData } from '../../model/ENode';
import { Box, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import useStyles from './EditorWizard.styles';
import { sortRelatedQuestions } from '../../utils/formBuilder';
import ETree from '../../model/ETree';
import { cloneDeep } from 'lodash';

type Props = {
  question: ENodeData;
  buildTreeList: any;
  tree: ETree;
  setTree: Dispatch<SetStateAction<ETree | null>>;
};

const EditorWizard: FC<Props> = ({ question, buildTreeList, tree, setTree }) => {
  const classes = useStyles();
  const relatedQuestions = question[Constants.HAS_SUBQUESTION];

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLDivElement).classList.add(classes.pageOver);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLDivElement).classList.remove(classes.pageOver);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLLIElement).style.opacity = '1';

      [].forEach.call(document.getElementsByClassName(classes.page), (page: HTMLDivElement) => {
        page.classList.remove(classes.pageOver);
      });

      if ((e.target as HTMLDivElement).id) {
        const moving = tree?.structure.get(e.dataTransfer.types.slice(-1)[0]);
        const target = tree?.structure.get((e.target as HTMLDivElement).id);

        if (!moving || !target) {
          return;
        }

        move(moving, target);

        e.dataTransfer.clearData();
      }
    }

    return false;
  };

  const move = (nodeToMove: ENode, page: ENode) => {
    const newTree = cloneDeep(tree);

    nodeToMove = newTree.structure.get(nodeToMove.data['@id']);
    page = newTree.structure.get(page.data['@id']);

    if (!nodeToMove?.data || !page?.data) {
      console.warn('Error3');
      return;
    }

    // if node with preceding question is moved, it loses its preceding question
    if (nodeToMove.data[Constants.HAS_PRECEDING_QUESTION]) {
      delete nodeToMove.data[Constants.HAS_PRECEDING_QUESTION];
    }

    if (!nodeToMove?.parent) {
      console.warn('Error');
      return;
    }

    const oldNodeParent = nodeToMove.parent;

    if (!oldNodeParent?.data || !page?.data) {
      console.warn('Error1');
      return;
    }

    // if some node has nodeToMove as a preceding node, it loses it
    oldNodeParent.data[Constants.HAS_SUBQUESTION].forEach((nodeData: ENodeData) => {
      if (
        nodeData[Constants.HAS_PRECEDING_QUESTION] &&
        nodeData[Constants.HAS_PRECEDING_QUESTION]['@id'] === nodeToMove.data['@id']
      ) {
        delete nodeData[Constants.HAS_PRECEDING_QUESTION];
      }
    });

    if (!oldNodeParent || !page) {
      console.warn('Error2');
      return;
    }

    nodeToMove.parent = page;

    oldNodeParent.data[Constants.HAS_SUBQUESTION] = oldNodeParent.data[Constants.HAS_SUBQUESTION].filter(
      (node: ENodeData) => node['@id'] !== nodeToMove.data['@id']
    );

    page.data[Constants.HAS_SUBQUESTION].push(nodeToMove.data);

    page.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(page.data[Constants.HAS_SUBQUESTION]);

    setTree(newTree);
  };

  return (
    <React.Fragment>
      {relatedQuestions &&
        relatedQuestions.map((q) => (
          <Box
            key={q['@id']}
            id={q['@id']}
            className={classes.page}
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
                <ul id={q['@id']}>
                  {q[Constants.HAS_SUBQUESTION] && q[Constants.HAS_SUBQUESTION].map((q) => buildTreeList(q))}
                </ul>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Box>
        ))}
    </React.Fragment>
  );
};

export default EditorWizard;

import React, { Dispatch, FC, SetStateAction, useRef } from 'react';
import ENode, { ENodeData } from '../../model/ENode';
import ETree from '../../model/ETree';
import { Constants } from 's-forms';
import useStyles from './EditorItem.styles';
import { cloneDeep } from 'lodash';
import { detectChild, sortRelatedQuestions } from '../../utils/formBuilder';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { DragHandle, MoreVert } from '@material-ui/icons';

type Props = {
  data: ENodeData;
  tree: ETree;
  setTree: Dispatch<SetStateAction<ETree | null>>;
};

const EditorItem: FC<Props> = ({ data, tree, setTree }) => {
  const classes = useStyles();
  const liContainer = useRef(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '0.4';

    e.dataTransfer.setData((e.target as HTMLLIElement).id, '');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '1';

    [].forEach.call(document.querySelectorAll('li'), (li: HTMLLIElement) => {
      li.classList.remove(classes.over);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    (e.target as HTMLLIElement).style.opacity = '1';

    [].forEach.call(document.querySelectorAll('li'), (li: HTMLLIElement) => {
      li.classList.remove(classes.over);
    });

    if ((e.target as HTMLLIElement).id) {
      const moving = tree?.structure.get(e.dataTransfer.types.slice(-1)[0]);
      const target = tree?.structure.get((e.target as HTMLLIElement).id);

      if (moving && target && detectChild(moving, target)) {
        return;
      }

      move(moving, target);
      e.dataTransfer.clearData();
    }

    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLLIElement).nodeName === 'LI') {
      const moving = tree?.structure.get(e.dataTransfer.types.slice(-1)[0]);
      const target = tree?.structure.get((e.target as HTMLLIElement).id);

      if (moving && target && detectChild(moving, target)) {
        return;
      }

      (e.target as HTMLLIElement).classList.add(classes.over);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).classList.remove(classes.over);
  };

  const move = (nodeToMove: ENode, nodeOfPlace: ENode) => {
    const newTree = cloneDeep(tree);

    nodeToMove = newTree.structure.get(nodeToMove.data['@id']);
    nodeOfPlace = newTree.structure.get(nodeOfPlace.data['@id']);

    if (!nodeToMove?.data || !nodeOfPlace?.data) {
      console.warn('Error3');

      return;
    }

    // if node with preceding question is moved, it loses its preceding question
    if (nodeToMove.data[Constants.HAS_PRECEDING_QUESTION]) {
      delete nodeToMove.data[Constants.HAS_PRECEDING_QUESTION];
    }

    if (!nodeToMove?.parent || !nodeOfPlace?.parent) {
      console.warn('Error');
      return;
    }

    const oldNodeParent = nodeToMove.parent;
    const newNodeParent = nodeOfPlace.parent;

    if (!oldNodeParent?.data || !newNodeParent?.data) {
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

    if (!oldNodeParent || !newNodeParent) {
      console.warn('Error2');
      return;
    }

    nodeToMove.parent = nodeOfPlace.parent;

    oldNodeParent.data[Constants.HAS_SUBQUESTION] = oldNodeParent.data[Constants.HAS_SUBQUESTION].filter(
      (node: ENodeData) => node['@id'] !== nodeToMove.data['@id']
    );

    newNodeParent.data[Constants.HAS_SUBQUESTION].push(nodeToMove.data);

    newNodeParent.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(newNodeParent.data[Constants.HAS_SUBQUESTION]);

    setTree(newTree);
  };

  const handleMouseEnter = () => {
    liContainer.current.setAttribute('draggable', 'true');
  };

  const handleMouseLeave = () => {
    liContainer.current.setAttribute('draggable', 'false');
  };

  return (
    <li
      id={data['@id']}
      className={classes.listItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={liContainer}
    >
      <Card variant="outlined">
        <CardHeader
          title={
            <div className={classes.cardHeader}>
              <span className={classes.cardHeaderItem}>{data[Constants.RDFS_LABEL] || data['@id']}</span>
              <span className={`${classes.cardHeaderItem} ${classes.cardHeaderItemCenter}`}>
                <DragHandle
                  className={classes.cardHeaderDrag}
                  focusable={true}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </span>
              <span className={`${classes.cardHeaderItem} ${classes.cardHeaderItemRight}`}>
                <MoreVert />
              </span>
            </div>
          }
          disableTypography={true}
        />
        <CardContent>kuk</CardContent>
      </Card>
    </li>
  );
};

export default EditorItem;

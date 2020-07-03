import React, { FC, Fragment, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { buildFormStructure, sortRelatedQuestions } from '../../utils/formBuilder';
import ENode, { ENodeData } from '../../model/ENode';
import useStyles from './Editor.styles';
import { Constants } from 's-forms';
import ETree from '../../model/ETree';

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

  const detectChild = (testedNode: ENode, exemplarNode: ENode): boolean => {
    if (!exemplarNode.parent) {
      return false;
    }

    return testedNode.data['@id'] === exemplarNode.data['@id'] ? true : detectChild(testedNode, exemplarNode.parent);
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '0.4';

    e.dataTransfer.effectAllowed = 'move';
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

  const treeList = () => {
    if (!tree) {
      return null;
    }

    const root = tree.root;

    const buildTreeList = (node: ENodeData, isRoot: boolean = false) => {
      const listItem = !isRoot && (
        <li
          id={node['@id']}
          className={classes.listItem}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {node[Constants.RDFS_LABEL] || node['@id']}
        </li>
      );

      const relatedQuestions = node[Constants.HAS_SUBQUESTION];

      return (
        <Fragment key={node['@id']}>
          {listItem}
          {relatedQuestions && <ul>{relatedQuestions.map((q) => buildTreeList(q))}</ul>}
        </Fragment>
      );
    };

    return buildTreeList(root.data, true);
  };

  return treeList();
};

export default Editor;

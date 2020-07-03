import React, { FC, useState, Fragment, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { buildFormStructure } from '../../utils/formBuilder';
import { ENodeData } from '../../model/ENode';
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

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '0.4';

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', (e.target as HTMLLIElement).id);
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
      move(e.dataTransfer.getData('text'), (e.target as HTMLLIElement).id);
      e.dataTransfer.clearData();
    }

    return false;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLLIElement).nodeName === 'LI') {
      (e.target as HTMLLIElement).classList.add(classes.over);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).classList.remove(classes.over);
  };

  const move = (idToMove: string, idOfPlace: string) => {
    const newTree = cloneDeep(tree);

    const nodeToMove = newTree.structure.get(idToMove);
    const nodeOfPlace = newTree.structure.get(idOfPlace);

    if (!nodeToMove?.parent || !nodeOfPlace?.parent) {
      console.warn('Error');
      return;
    }

    const oldNodeParent = nodeToMove.parent;
    const newNodeParent = nodeOfPlace.parent;

    if (!oldNodeParent || !newNodeParent) {
      console.warn('Error');
      return;
    }

    nodeToMove.parent = nodeOfPlace.parent;

    oldNodeParent.data[Constants.HAS_SUBQUESTION] = oldNodeParent.data[Constants.HAS_SUBQUESTION].filter(
      (node: ENodeData) => node['@id'] !== nodeToMove.data['@id']
    );

    newNodeParent.data[Constants.HAS_SUBQUESTION].push(nodeToMove.data);

    setTree(newTree);
  };

  const treeList = () => {
    if (!tree) {
      return null;
    }

    const root = tree.root;

    const buildTreeList = (node: ENodeData) => {
      const listItem =
        root.data === node ? (
          <li id={node['@id']} className={`${classes.listItem} ${classes.listItemRoot}`}>
            {node['@id']}
          </li>
        ) : (
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

      let relatedQuestions = node[Constants.HAS_SUBQUESTION];

      return (
        <Fragment key={node['@id']}>
          {listItem}
          {relatedQuestions && (
            <ul>
              {relatedQuestions.map((q) => {
                if (!q) {
                  console.error('err');
                  return;
                }

                return buildTreeList(q);
              })}
            </ul>
          )}
        </Fragment>
      );
    };

    return <ul>{buildTreeList(root.data)}</ul>;
  };

  return treeList();
};

export default Editor;

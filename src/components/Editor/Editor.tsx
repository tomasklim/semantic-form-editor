import React, { FC, useState, Fragment } from 'react';
import { cloneDeep } from 'lodash';
import { buildTree } from '../../utils/treeBuilder';
import ENode from '../../model/ENode';
import useStyles from './Editor.styles';

type Props = {};

const Editor: FC<Props> = ({}) => {
  const classes = useStyles();

  const [tree, setTree] = useState(buildTree());

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

    const oldNodeParent = newTree.structure.get(nodeToMove.parent);
    const newNodeParent = newTree.structure.get(nodeOfPlace.parent);

    if (!oldNodeParent || !newNodeParent) {
      console.warn('Error');
      return;
    }

    nodeToMove.parent = nodeOfPlace.parent;

    oldNodeParent.data.has_related_question = oldNodeParent.data.has_related_question.filter((id) => id !== idToMove);
    newNodeParent.data.has_related_question.push(idToMove);

    setTree(newTree);
  };

  const treeList = () => {
    const root = tree.root;

    const buildTreeList = (node: ENode) => {
      let relatedQuestions = node.data.has_related_question;

      return (
        <Fragment key={node.data['@id']}>
          <li
            id={node.data['@id']}
            className={classes.listItem}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {node.data['label'] || node.data['@id']}
          </li>
          {relatedQuestions && (
            <ul>
              {relatedQuestions.map((q) => {
                const nodeId = tree.structure.get(q);

                if (!nodeId) {
                  console.error('err');
                  return;
                }

                return buildTreeList(nodeId);
              })}
            </ul>
          )}
        </Fragment>
      );
    };

    return <ul>{buildTreeList(root)}</ul>;
  };

  return treeList();
};

export default Editor;

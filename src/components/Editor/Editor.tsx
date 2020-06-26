import React, { FC, useRef, useState } from 'react';
import useStyles from './Editor.styles';

Array.prototype.move = function (from: number, to: number) {
  if (from < to) {
    const el = this[from];
    this.splice(from, 1);
    this.splice(to, 0, el);
  } else if (from > to) {
    const el = this[from];
    this.splice(from, 1);
    this.splice(to + 1, 0, el);
  }
};

type Props = {};

const Editor: FC<Props> = ({}) => {
  const classes = useStyles();
  const ul = useRef<HTMLUListElement>(null);

  const [order, setOrder] = useState(['1', '2', '3', '4', '5']);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '0.4';

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', (e.target as HTMLLIElement).id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '1';

    if (ul.current) {
      [].forEach.call(ul.current.children, (li: HTMLLIElement) => {
        li.classList.remove(classes.over);
      });
    }
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

    if (ul.current) {
      [].forEach.call(ul.current.children, (li: HTMLLIElement) => {
        li.classList.remove(classes.over);
      });
    }

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

  const move = (id1: string, id2: string) => {
    let pos1 = order.findIndex((el) => el === id1);
    let pos2 = order.findIndex((el) => el === id2);

    let copyList = [...order];

    copyList.move(pos1, pos2);

    setOrder(copyList);
  };

  const lis = order.map((id) => (
    <li
      id={id}
      key={id}
      className={classes.listItem}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="text" value={id} disabled={true} />
    </li>
  ));

  return <ul ref={ul}>{lis}</ul>;
};

export default Editor;

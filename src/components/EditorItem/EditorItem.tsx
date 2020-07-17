import React, { FC, useRef } from 'react';
import { ENodeData } from '../../model/ENode';
import useStyles from './EditorItem.styles';
import { Card } from '@material-ui/core';
import ItemHeader from '@components/ItemHeader/ItemHeader';
import ItemContent from '@components/ItemContent/ItemContent';

type Props = {
  data: ENodeData;
};

const EditorItem: FC<Props> = ({ data }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '0.4';

    document
      .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
      .forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'none'));

    document
      .querySelectorAll('[data-droppable=true],[draggable=true]')
      .forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'all'));

    e.dataTransfer.setData((e.target as HTMLLIElement).id, '');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '1';

    document
      .querySelectorAll('*')
      .forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'all'));
  };

  return (
    <li
      id={data['@id']}
      className={classes.listItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      ref={itemContainer}
    >
      <Card variant="outlined">
        <ItemHeader container={itemContainer} nodeData={data} />
        <ItemContent />
      </Card>
    </li>
  );
};

export default EditorItem;

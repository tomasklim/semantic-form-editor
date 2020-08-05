import React, { FC, useRef } from 'react';
import useStyles from './EditorItem.styles';
import { Card } from '@material-ui/core';
import ItemHeader from '@components/ItemHeader/ItemHeader';
import ItemContent from '@components/ItemContent/ItemContent';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';

type Props = {
  questionData: FormStructureQuestion;
};

const EditorItem: FC<Props> = ({ questionData }) => {
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
      id={questionData['@id']}
      ref={itemContainer}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={classes.listItem}
    >
      <Card variant="outlined">
        <ItemHeader container={itemContainer} nodeData={questionData} />
        <ItemContent />
      </Card>
    </li>
  );
};

export default EditorItem;

import React, { FC, useRef } from 'react';
import useStyles, { CustomisedCard } from './EditorItem.styles';
import ItemHeader from '@components/ItemHeader/ItemHeader';
import ItemContent from '@components/ItemContent/ItemContent';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';

type Props = {
  questionData: FormStructureQuestion;
  position: number;
};

const EditorItem: FC<Props> = ({ questionData, position }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    itemContainer.current?.classList.add('listItemHover');
  };

  const handleMouseLeave = () => {
    itemContainer.current?.classList.remove('listItemHover');
  };

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classes.listItem}
    >
      <CustomisedCard variant="outlined">
        <ItemHeader container={itemContainer} nodeData={questionData} position={position} />
        <ItemContent />
      </CustomisedCard>
    </li>
  );
};

export default EditorItem;

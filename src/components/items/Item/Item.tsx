import React, { FC, useRef } from 'react';
import useStyles, { CustomisedCard } from './Item.styles';
import ItemHeader from '@components/ItemHeader/ItemHeader';
import ItemContent from '@components/ItemContent/ItemContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { handleDragEnd, handleDragStart } from '@utils/itemDragHelpers';

type Props = {
  questionData: FormStructureQuestion;
  position: number;
};

const Item: FC<Props> = ({ questionData, position }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    itemContainer.current?.classList.add('listItemHover');
  };

  const handleMouseLeave = () => {
    itemContainer.current?.classList.remove('listItemHover');
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

export default Item;

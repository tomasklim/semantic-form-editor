import React, { FC, useContext, useRef } from 'react';
import useStyles, { CustomisedCard } from './Item.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import ItemContent from '@components/items/ItemContent/ItemContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { handleDragEnd, handleDragStart } from '@utils/index';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';
import { FormStructureContext } from '@contexts/FormStructureContext';

type Props = {
  questionData: FormStructureQuestion;
  position: number;
};

const Item: FC<Props> = ({ questionData, position }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const { customiseItemData } = useContext(CustomiseItemContext);
  const { updateNode } = useContext(FormStructureContext);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    itemContainer.current?.classList.add('listItemHover');
  };

  const handleMouseLeave = () => {
    itemContainer.current?.classList.remove('listItemHover');
  };

  const onClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    customiseItemData({
      itemData: questionData,
      onSave: () => (itemData: FormStructureQuestion) => {
        updateNode(itemData);
      },
      onInit: () => itemContainer.current?.classList.add(classes.listItemHighlight),
      onCancel: () => () => itemContainer.current?.classList.remove(classes.listItemHighlight)
    });
  };

  return (
    <li
      id={questionData['@id']}
      ref={itemContainer}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClickHandler}
      className={classes.listItem}
    >
      <CustomisedCard variant="outlined">
        <ItemHeader container={itemContainer} nodeData={questionData} position={position} expandable={false} />
        <ItemContent questionData={questionData} />
      </CustomisedCard>
    </li>
  );
};

export default Item;

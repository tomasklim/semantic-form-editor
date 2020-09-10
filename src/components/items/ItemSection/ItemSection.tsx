import React, { FC, useContext, useRef } from 'react';
import useStyles, { CustomisedCard } from './ItemSection.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { Constants } from 's-forms';
import ItemAdd from '@components/items/AddItem/AddItem';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomisedCardContent } from '@styles/CustomisedCardContent';
import { enableNotDraggableAndDroppable, handleDragEnd, handleDragStart } from '@utils/itemDragHelpers';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';

type Props = {
  questionData: FormStructureQuestion;
  position: number;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
};

const ItemSection: FC<Props> = ({ questionData, position, buildFormUI }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const { moveNodeUnderNode, updateNode } = useContext(FormStructureContext);
  const { customiseItemData } = useContext(CustomiseItemContext);

  const onClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    customiseItemData({
      itemData: questionData,
      onSave: () => (itemData: FormStructureQuestion) => {
        updateNode(itemData);
      },
      onInit: () => itemContainer.current?.classList.add(classes.listItemSectionHighlight),
      onCancel: () => () => itemContainer.current?.classList.remove(classes.listItemSectionHighlight)
    });
  };

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    itemContainer.current?.classList.add('listItemHover');
  };

  const handleMouseLeave = () => {
    itemContainer.current?.classList.remove('listItemHover');
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const correct = (e.target as HTMLOListElement | HTMLDivElement).id === questionData['@id'];

    if (correct && !itemContainer.current?.classList.contains('listItemHover')) {
      itemContainer.current?.classList.add('listItemHover');
    } else if (!correct && itemContainer.current?.classList.contains('listItemHover')) {
      itemContainer.current?.classList.remove('listItemHover');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.listItemSection)) {
      (e.target as HTMLDivElement).classList.add(classes.listItemSectionOver);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.listItemSection)) {
      (e.target as HTMLDivElement).classList.remove(classes.listItemSectionOver);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.listItemSection)) {
      e.preventDefault();

      (e.target as HTMLDivElement).style.opacity = '1';

      enableNotDraggableAndDroppable();

      [].forEach.call(document.getElementsByClassName(classes.listItemSection), (page: HTMLDivElement) => {
        page.classList.remove(classes.listItemSectionOver);
      });

      const destinationPageId = (e.target as HTMLDivElement).id;
      const movingNodeId = e.dataTransfer.types.slice(-1)[0];

      if (destinationPageId === movingNodeId) {
        console.warn('Cannot move item under the same item!');
        return;
      }

      e.dataTransfer.clearData();

      if (!destinationPageId || !movingNodeId) {
        console.warn('Missing destinationPageId or movingNodeId');
        return;
      }

      moveNodeUnderNode(movingNodeId, destinationPageId);
    }
  };

  return (
    <li
      id={questionData['@id']}
      ref={itemContainer}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classes.listItemSection}
      data-droppable={true}
      onClick={onClickHandler}
    >
      <CustomisedCard variant="outlined">
        <ItemHeader container={itemContainer} nodeData={questionData} position={position} />
        <CustomisedCardContent className={classes.cardContent} id={questionData['@id']} onMouseOver={handleMouseOver}>
          <ol id={questionData['@id']} className={classes.ol}>
            {questionData[Constants.HAS_SUBQUESTION]!.length > 0 && (
              <ItemAdd parentId={questionData['@id']} position={0} />
            )}
            {questionData[Constants.HAS_SUBQUESTION]!.map((q, index) => buildFormUI(q, index + 1, questionData))}
            {!questionData[Constants.HAS_SUBQUESTION]!.length && (
              <div className={classes.emptySection}>Empty section...</div>
            )}
          </ol>
        </CustomisedCardContent>
      </CustomisedCard>
    </li>
  );
};

export default ItemSection;

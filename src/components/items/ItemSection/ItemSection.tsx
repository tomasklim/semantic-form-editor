import React, { FC, useContext, useRef, useState } from 'react';
import useStyles, { CustomisedAccordionDetails } from './ItemSection.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { Constants } from 's-forms';
import ItemAdd from '@components/items/ItemAdd/ItemAdd';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { enableNotDraggableAndDroppable, handleDragEnd, handleDragStart, highlightQuestion } from '@utils/index';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';
import { Accordion } from '@material-ui/core';

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

  const [expanded, setExpanded] = useState<boolean>(true);

  const { moveNodeUnderNode, updateNode } = useContext(FormStructureContext);
  const { customiseItemData } = useContext(CustomiseItemContext);

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

      if (!destinationPageId || !movingNodeId) {
        console.warn('Missing destinationPageId or movingNodeId');
        return;
      }

      moveNodeUnderNode(movingNodeId, destinationPageId);
    }
  };

  const onClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    customiseItemData({
      itemData: questionData,
      onSave: () => (itemData: FormStructureQuestion) => {
        updateNode(itemData);
        highlightQuestion(itemData['@id']);
      },
      onInit: () => itemContainer.current?.classList.add(classes.listItemSectionHighlight),
      onCancel: () => () => itemContainer.current?.classList.remove(classes.listItemSectionHighlight)
    });
  };

  const expandItemSection = (e: React.MouseEvent) => {
    e.stopPropagation();

    setExpanded(!expanded);
  };

  const relatedQuestions = questionData[Constants.HAS_SUBQUESTION];

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
      <Accordion expanded={expanded} variant="outlined">
        <ItemHeader
          container={itemContainer}
          nodeData={questionData}
          position={position}
          expandable={true}
          expanded={expanded}
          expandItemSection={expandItemSection}
        />
        <CustomisedAccordionDetails
          className={classes.cardContent}
          id={questionData['@id']}
          onMouseOver={handleMouseOver}
        >
          <ol id={questionData['@id']} className={classes.ol}>
            {relatedQuestions!.length > 0 && <ItemAdd parentId={questionData['@id']} position={0} />}
            {relatedQuestions!.map((question, index) => buildFormUI(question, index + 1, questionData))}
            {!relatedQuestions!.length && (
              <div id={questionData['@id']} className={classes.emptySection}>
                Empty section...
              </div>
            )}
          </ol>
        </CustomisedAccordionDetails>
      </Accordion>
    </li>
  );
};

export default ItemSection;

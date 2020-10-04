import React, { FC, useContext, useRef, useState } from 'react';
import useStyles, { CustomisedAccordionDetails } from './ItemSection.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { Constants } from 's-forms';
import { FormStructureContext } from '@contexts/FormStructureContext';
import {
  detectIsChildNode,
  enableNotDraggableAndDroppable,
  handleDragEnd,
  handleDragStart,
  highlightQuestion
} from '@utils/index';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { Accordion } from '@material-ui/core';

type Props = {
  question: FormStructureQuestion;
  position: number;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
};

const ItemSection: FC<Props> = ({ question, position, buildFormUI }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const [expanded, setExpanded] = useState<boolean>(true);

  const { formStructure, moveNodeUnderNode, updateNode } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
  const handleMouseEnter = () => {
    itemContainer.current?.classList.add('itemHover');
  };

  const handleMouseLeave = () => {
    itemContainer.current?.classList.remove('itemHover');
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const correct = (e.target as HTMLOListElement | HTMLDivElement).id === question['@id'];

    if (correct && !itemContainer.current?.classList.contains('itemHover')) {
      itemContainer.current?.classList.add('itemHover');
    } else if (!correct && itemContainer.current?.classList.contains('itemHover')) {
      itemContainer.current?.classList.remove('itemHover');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.listItemSection)) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);
      const targetNode = formStructure.getNode((e.target as HTMLLIElement).id);

      // if target element is child of moving element => no highlight
      if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
        return;
      }

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

      const movingNodeId = e.dataTransfer.types.slice(-1)[0];
      const targetNodeId = (e.target as HTMLDivElement).id;

      if (targetNodeId === movingNodeId) {
        console.warn('Cannot move item under the same item!');
        return;
      }

      if (!targetNodeId || !movingNodeId) {
        console.warn('Missing targetNodeId or movingNodeId');
        return;
      }

      document.getElementById('question-drop-area')!.style.display = 'none';

      moveNodeUnderNode(movingNodeId, targetNodeId);
    }
  };

  const onClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    customiseQuestion({
      customisingQuestion: question,
      onSave: () => (customisingQuestion: FormStructureQuestion) => {
        updateNode(customisingQuestion);
        highlightQuestion(customisingQuestion['@id']);
      },
      onInit: () => itemContainer.current?.classList.add(classes.listItemSectionHighlight),
      onCancel: () => () => itemContainer.current?.classList.remove(classes.listItemSectionHighlight)
    });
  };

  const expandItemSection = (e: React.MouseEvent) => {
    e.stopPropagation();

    setExpanded(!expanded);
  };

  const onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    document.getElementById('question-drop-area')!.style.display = 'block';

    handleDragStart(e);
  };

  const onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    document.getElementById('question-drop-area')!.style.display = 'none';

    handleDragEnd(e);
  };

  const subquestions = question[Constants.HAS_SUBQUESTION];

  return (
    <li
      id={question['@id']}
      ref={itemContainer}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
          question={question}
          position={position + 1}
          expandable={true}
          expanded={expanded}
          expandItemSection={expandItemSection}
        />
        <CustomisedAccordionDetails className={classes.cardContent} id={question['@id']} onMouseOver={handleMouseOver}>
          <ol id={question['@id']}>
            {subquestions && subquestions.map((subquestion, index) => buildFormUI(subquestion, index, question))}
            {subquestions && !subquestions.length && (
              <div id={question['@id']} className={classes.emptySection}>
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

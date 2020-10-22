import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useStyles, { CustomisedAccordionDetails } from './ItemSection.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { Constants, FormUtils } from 's-forms';
import { FormStructureContext } from '@contexts/FormStructureContext';
import {
  detectIsChildNode,
  enableNotDraggableAndDroppable,
  handleDragEnd,
  handleDragStart,
  onItemClickHandler
} from '@utils/index';
import { Accordion } from '@material-ui/core';

import { EditorContext } from '@contexts/EditorContext';
import { CustomiseQuestion } from '@contexts/CustomiseQuestionContext';
import useOnMouseItemEvent from '../../../hooks/useOnMouseItemEvent/useOnMouseItemEvent';

type ItemSectionProps = {
  question: FormStructureQuestion;
  position: number;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
  customiseQuestion: CustomiseQuestion;
};

const ItemSection: FC<ItemSectionProps> = ({ question, position, buildFormUI, customiseQuestion }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const [expanded, setExpanded] = useState<boolean>(true);

  const { formStructure, moveNodeUnderNode, updateNode } = useContext(FormStructureContext);
  const { intl, sectionsExpanded } = useContext(EditorContext);

  const [handleMouseEnter, handleMouseLeave] = useOnMouseItemEvent(itemContainer, 'itemHover');

  useEffect(() => {
    setExpanded(sectionsExpanded);
  }, [sectionsExpanded]);

  useEffect(() => {
    setExpanded(true);
  }, []);

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

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const correctLevel = (e.target as HTMLOListElement | HTMLDivElement).id === question['@id'];

    if (correctLevel && !itemContainer.current?.classList.contains('itemHover')) {
      itemContainer.current?.classList.add('itemHover');
    } else if (!correctLevel && itemContainer.current?.classList.contains('itemHover')) {
      itemContainer.current?.classList.remove('itemHover');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains('listItemSection')) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);
      const targetNode = formStructure.getNode((e.target as HTMLLIElement).id);

      // if target element is child of moving element => no highlight
      if (movingNode && targetNode && detectIsChildNode(movingNode, targetNode)) {
        return;
      }

      (e.target as HTMLDivElement).classList.add('listItemSectionOver');
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains('listItemSection')) {
      (e.target as HTMLDivElement).classList.remove('listItemSectionOver');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    if ((e.target as HTMLDivElement).classList.contains('listItemSection')) {
      e.preventDefault();

      (e.target as HTMLDivElement).style.opacity = '1';

      enableNotDraggableAndDroppable();

      [].forEach.call(document.getElementsByClassName('listItemSection'), (section: HTMLDivElement) => {
        section.classList.remove('listItemSectionOver');
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

      moveNodeUnderNode(movingNodeId, targetNodeId, false, intl);
    }
  };

  const onItemClick = (e: React.MouseEvent) => {
    onItemClickHandler(
      e,
      customiseQuestion,
      question,
      updateNode,
      itemContainer,
      classes.listItemSectionHighlight,
      intl
    );
  };

  return useMemo(() => {
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
        className={'listItemSection'}
        data-droppable={true}
        onClick={onItemClick}
        data-testid={FormUtils.isWizardStep(question) ? 'item-wizard-step' : 'item-section'}
      >
        <Accordion expanded={expanded} variant="outlined">
          <ItemHeader
            container={itemContainer}
            question={question}
            position={position + 1}
            expandable={true}
            expanded={expanded}
            expandItemSection={expandItemSection}
            customiseQuestion={customiseQuestion}
            onItemClick={onItemClick}
          />
          <CustomisedAccordionDetails
            className={classes.cardContent}
            id={question['@id']}
            onMouseOver={handleMouseOver}
          >
            <ol id={question['@id']}>
              {subquestions &&
                subquestions.map((subquestion: FormStructureQuestion, index: number) =>
                  buildFormUI(subquestion, index, question)
                )}
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
  }, [question, position, expanded, intl]);
};

export default ItemSection;

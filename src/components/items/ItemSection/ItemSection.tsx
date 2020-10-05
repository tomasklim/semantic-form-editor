import React, { FC, useContext, useMemo, useRef, useState } from 'react';
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
  onItemClickHandler
} from '@utils/index';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { Accordion } from '@material-ui/core';
import FormStructure from '@model/FormStructure';
import { IIntl } from '@interfaces/index';
import { EditorContext } from '@contexts/EditorContext';

const onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
  document.getElementById('question-drop-area')!.style.display = 'block';

  handleDragStart(e);
};

const onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
  document.getElementById('question-drop-area')!.style.display = 'none';

  handleDragEnd(e);
};

const handleMouseEnter = (itemContainer: React.MutableRefObject<HTMLLIElement | null>) => {
  itemContainer.current?.classList.add('itemHover');
};

const handleMouseLeave = (itemContainer: React.MutableRefObject<HTMLLIElement | null>) => {
  itemContainer.current?.classList.remove('itemHover');
};

const handleMouseOver = (
  e: React.MouseEvent<HTMLDivElement>,
  itemContainer: React.MutableRefObject<HTMLLIElement | null>,
  question: FormStructureQuestion
) => {
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

const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, formStructure: FormStructure) => {
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

const handleDrop = (
  e: React.DragEvent<HTMLLIElement>,
  moveNodeUnderNode: (movingNodeId: string, targetNodeId: string, isWizardPosition: boolean, intl: IIntl) => void,
  intl: IIntl
) => {
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

type ItemSectionProps = {
  question: FormStructureQuestion;
  position: number;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
};

const ItemSection: FC<ItemSectionProps> = ({ question, position, buildFormUI }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const [expanded, setExpanded] = useState<boolean>(true);

  const { formStructure, moveNodeUnderNode, updateNode } = useContext(FormStructureContext);
  const { customiseQuestion } = useContext(CustomiseQuestionContext);
  const { intl } = useContext(EditorContext);

  const expandItemSection = (e: React.MouseEvent) => {
    e.stopPropagation();

    setExpanded(!expanded);
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
        onDragEnter={(e) => handleDragEnter(e, formStructure)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, moveNodeUnderNode, intl)}
        onMouseEnter={() => handleMouseEnter(itemContainer)}
        onMouseLeave={() => handleMouseLeave(itemContainer)}
        className={'listItemSection'}
        data-droppable={true}
        onClick={(e) =>
          onItemClickHandler(
            e,
            customiseQuestion,
            question,
            updateNode,
            itemContainer,
            classes.listItemSectionHighlight,
            intl
          )
        }
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
          <CustomisedAccordionDetails
            className={classes.cardContent}
            id={question['@id']}
            onMouseOver={(e) => handleMouseOver(e, itemContainer, question)}
          >
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
  }, [question, expanded]);
};

export default ItemSection;

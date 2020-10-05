import React, { FC, useContext, useMemo, useRef } from 'react';
import useStyles, { CustomisedCard } from './Item.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import ItemContent from '@components/items/ItemContent/ItemContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { getIntl, handleDragEnd, handleDragStart, onItemClickHandler } from '@utils/index';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';

const handleMouseEnter = (itemContainer: React.MutableRefObject<HTMLLIElement | null>) => {
  itemContainer.current?.classList.add('itemHover');
};

const handleMouseLeave = (itemContainer: React.MutableRefObject<HTMLLIElement | null>) => {
  itemContainer.current?.classList.remove('itemHover');
};

const onDragStart = (e: React.DragEvent<HTMLLIElement>, isWizardless: boolean) => {
  if (isWizardless) {
    document.getElementById('question-drop-area')!.style.display = 'block';
  }

  handleDragStart(e);
};

const onDragEnd = (e: React.DragEvent<HTMLLIElement>, isWizardless: boolean) => {
  if (isWizardless) {
    document.getElementById('question-drop-area')!.style.display = 'none';
  }

  handleDragEnd(e);
};

type ItemProps = {
  question: FormStructureQuestion;
  position: number;
};

const Item: FC<ItemProps> = ({ question, position }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const { customiseQuestion } = useContext(CustomiseQuestionContext);
  const { updateNode, isWizardless } = useContext(FormStructureContext);
  const { languages } = useContext(EditorContext);

  return useMemo(
    () => (
      <li
        id={question['@id']}
        ref={itemContainer}
        onDragStart={(e) => onDragStart(e, isWizardless)}
        onDragEnd={(e) => onDragEnd(e, isWizardless)}
        onMouseEnter={() => handleMouseEnter(itemContainer)}
        onMouseLeave={() => handleMouseLeave(itemContainer)}
        onClick={(e) =>
          onItemClickHandler(
            e,
            customiseQuestion,
            question,
            updateNode,
            itemContainer,
            classes.listItemHighlight,
            getIntl(languages[0])
          )
        }
        className={classes.listItem}
      >
        <CustomisedCard variant="outlined">
          <ItemHeader container={itemContainer} question={question} position={position + 1} />
          <ItemContent question={question} />
        </CustomisedCard>
      </li>
    ),
    [question, position]
  );
};

export default Item;

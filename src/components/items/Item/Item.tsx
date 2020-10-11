import React, { FC, useContext, useMemo, useRef } from 'react';
import useStyles, { CustomisedCard } from './Item.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import ItemContent from '@components/items/ItemContent/ItemContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { handleDragEnd, handleDragStart, onItemClickHandler } from '@utils/index';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';
import { CustomiseQuestion } from '@contexts/CustomiseQuestionContext';

type ItemProps = {
  question: FormStructureQuestion;
  position: number;
  customiseQuestion: CustomiseQuestion;
};

const Item: FC<ItemProps> = ({ question, position, customiseQuestion }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const { updateNode, isWizardless } = useContext(FormStructureContext);
  const { intl } = useContext(EditorContext);

  const handleMouseEnter = () => {
    itemContainer.current?.classList.add('itemHover');
  };

  const handleMouseLeave = () => {
    itemContainer.current?.classList.remove('itemHover');
  };

  const onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    if (isWizardless) {
      document.getElementById('question-drop-area')!.style.display = 'block';
    }

    handleDragStart(e);
  };

  const onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    if (isWizardless) {
      document.getElementById('question-drop-area')!.style.display = 'none';
    }

    handleDragEnd(e);
  };

  return useMemo(
    () => (
      <li
        id={question['@id']}
        ref={itemContainer}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) =>
          onItemClickHandler(e, customiseQuestion, question, updateNode, itemContainer, classes.listItemHighlight, intl)
        }
        className={classes.listItem}
      >
        <CustomisedCard variant="outlined">
          <ItemHeader
            container={itemContainer}
            question={question}
            position={position + 1}
            customiseQuestion={customiseQuestion}
          />
          <ItemContent question={question} />
        </CustomisedCard>
      </li>
    ),
    [question, position, intl]
  );
};

export default Item;

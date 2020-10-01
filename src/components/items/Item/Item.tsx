import React, { FC, useContext, useRef } from 'react';
import useStyles, { CustomisedCard } from './Item.styles';
import ItemHeader from '@components/items/ItemHeader/ItemHeader';
import ItemContent from '@components/items/ItemContent/ItemContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { handleDragEnd, handleDragStart, highlightQuestion } from '@utils/index';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { FormStructureContext } from '@contexts/FormStructureContext';

type Props = {
  question: FormStructureQuestion;
  position: number;
};

const Item: FC<Props> = ({ question, position }) => {
  const classes = useStyles();
  const itemContainer = useRef<HTMLLIElement | null>(null);

  const { customiseQuestion } = useContext(CustomiseQuestionContext);
  const { updateNode, isWizardless } = useContext(FormStructureContext);

  // fix drag and drop bug https://stackoverflow.com/questions/17946886/hover-sticks-to-element-on-drag-and-drop
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

  const onClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    customiseQuestion({
      customisingQuestion: question,
      onSave: () => (customisingQuestion: FormStructureQuestion) => {
        updateNode(customisingQuestion);
        highlightQuestion(customisingQuestion['@id']);
      },
      onInit: () => itemContainer.current?.classList.add(classes.listItemHighlight),
      onCancel: () => () => itemContainer.current?.classList.remove(classes.listItemHighlight)
    });
  };

  return (
    <li
      id={question['@id']}
      ref={itemContainer}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClickHandler}
      className={classes.listItem}
    >
      <CustomisedCard variant="outlined">
        <ItemHeader container={itemContainer} question={question} position={position + 1} />
        <ItemContent question={question} />
      </CustomisedCard>
    </li>
  );
};

export default Item;

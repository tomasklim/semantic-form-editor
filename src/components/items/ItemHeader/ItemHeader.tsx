import React, { FC, useContext } from 'react';
import { Constants } from 's-forms';
import { DragIndicator, ExpandLess, ExpandMore } from '@material-ui/icons';
import useStyles, { CustomisedCardHeader } from './ItemHeader.styles';
import ItemMenu from '@components/items/ItemMenu/ItemMenu';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import ItemPropsIndicator from '@components/items/ItemPropsIndicator/ItemPropsIndicator';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';
import { EditorContext } from '@contexts/EditorContext';
import { CustomiseQuestion } from '@contexts/CustomiseQuestionContext';

type ItemHeaderProps = {
  container: React.MutableRefObject<HTMLLIElement | null>;
  question: FormStructureQuestion;
  position: number;
  expandable?: boolean;
  expanded?: boolean;
  expandItemSection?: (e: React.MouseEvent) => void;
  customiseQuestion: CustomiseQuestion;
  onItemClick: (e: React.MouseEvent) => void;
};

const ItemHeader: FC<ItemHeaderProps> = ({
  container,
  question,
  position,
  expandable,
  expanded,
  expandItemSection,
  customiseQuestion,
  onItemClick
}) => {
  const classes = useStyles();

  const { intl } = useContext(EditorContext);

  const addDraggable = () => {
    container?.current?.setAttribute('draggable', 'true');
  };

  const removeDraggable = () => {
    container?.current?.setAttribute('draggable', 'false');
  };

  return (
    <CustomisedCardHeader
      title={
        <div className={classes.cardHeader} onMouseEnter={addDraggable} onMouseLeave={removeDraggable}>
          <span className={classes.cardHeaderItemLeft}>
            {expandable && (
              <div
                className={classes.expandableSection}
                title={expanded ? 'Collapse section' : 'Expand section'}
                data-testid="collapse-button"
              >
                {expanded ? <ExpandLess onClick={expandItemSection} /> : <ExpandMore onClick={expandItemSection} />}
              </div>
            )}
            <DragIndicator className={classes.cardHeaderDrag} />
            <span className={classes.position}>{position}.</span>
            <span>{JsonLdUtils.getLocalized(question[Constants.RDFS_LABEL], intl) || question['@id']}</span>
            <ItemPropsIndicator question={question} />
          </span>
          <span className={classes.cardHeaderItemRight} onMouseEnter={removeDraggable} onMouseLeave={addDraggable}>
            <ItemMenu question={question} customiseQuestion={customiseQuestion} onItemClick={onItemClick} />
          </span>
        </div>
      }
      disableTypography={true}
    />
  );
};

export default ItemHeader;

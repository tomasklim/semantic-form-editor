import React, { FC } from 'react';
import useStyles, { CustomisedCardHeader } from './ItemHeader.styles';
import { Constants } from 's-forms';
import { DragIndicator, ExpandLess, ExpandMore } from '@material-ui/icons';
import ItemMenu from '@components/items/ItemMenu/ItemMenu';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import ItemPropsIndicator from '@components/items/ItemPropsIndicator/ItemPropsIndicator';

type ItemHeaderProps = {
  container: React.MutableRefObject<HTMLLIElement | null>;
  nodeData: FormStructureQuestion;
  position: number;
  expandable?: boolean;
  expanded?: boolean;
  expandItemSection?: (e: React.MouseEvent) => void;
};

const ItemHeader: FC<ItemHeaderProps> = ({
  container,
  nodeData,
  position,
  expandable,
  expanded,
  expandItemSection
}) => {
  const classes = useStyles();

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
              <div className={classes.expandableSection} title={expanded ? 'Collapse section' : 'Expand section'}>
                {expanded ? <ExpandLess onClick={expandItemSection} /> : <ExpandMore onClick={expandItemSection} />}
              </div>
            )}
            <DragIndicator className={classes.cardHeaderDrag} />
            <span>
              {position}
              {'. '}
              {nodeData[Constants.RDFS_LABEL] || nodeData['@id']}
            </span>
            <ItemPropsIndicator question={nodeData} />
          </span>
          <span className={classes.cardHeaderItemRight} onMouseEnter={removeDraggable} onMouseLeave={addDraggable}>
            <ItemMenu question={nodeData} />
          </span>
        </div>
      }
      disableTypography={true}
    />
  );
};

export default ItemHeader;

import React, { FC } from 'react';
import useStyles from './ItemHeader.styles';
import { Constants } from 's-forms';
import { DragIndicator } from '@material-ui/icons';
import { CardHeader } from '@material-ui/core';
import MenuQuestionItem from '../../MenuQuestionItem/MenuQuestionItem';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';

type ItemHeaderProps = {
  container: React.MutableRefObject<HTMLLIElement | null>;
  nodeData: FormStructureQuestion;
  position: number;
};

const ItemHeader: FC<ItemHeaderProps> = ({ container, nodeData, position }) => {
  const classes = useStyles();

  const addDraggable = () => {
    container?.current?.setAttribute('draggable', 'true');
  };

  const removeDraggable = () => {
    container?.current?.setAttribute('draggable', 'false');
  };

  return (
    <CardHeader
      className={classes.cardHeaderRoot}
      title={
        <div className={classes.cardHeader} onMouseEnter={addDraggable} onMouseLeave={removeDraggable}>
          <span className={classes.cardHeaderItemLeft}>
            <DragIndicator className={classes.cardHeaderDrag} />
            <span>
              {position}
              {'. '}
              {nodeData[Constants.RDFS_LABEL] || nodeData['@id']} {nodeData[Constants.HAS_PRECEDING_QUESTION] && '^'}
            </span>
          </span>
          <span className={classes.cardHeaderItemRight} onMouseEnter={removeDraggable} onMouseLeave={addDraggable}>
            <MenuQuestionItem question={nodeData} />
          </span>
        </div>
      }
      disableTypography={true}
    />
  );
};

export default ItemHeader;

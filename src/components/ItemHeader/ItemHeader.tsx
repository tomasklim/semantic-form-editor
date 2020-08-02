import React, { Dispatch, FC, SetStateAction } from 'react';
import useStyles from './ItemHeader.styles';
import { Constants } from 's-forms';
import { DragHandle } from '@material-ui/icons';
import { CardHeader } from '@material-ui/core';
import { ENodeData } from '../../model/ENode';
import MenuQuestionItem from '../../MenuQuestionItem/MenuQuestionItem';
import ETree from '../../model/ETree';

type ItemHeaderProps = {
  container: React.MutableRefObject<HTMLLIElement | null>;
  nodeData: ENodeData;
  formStructure: ETree;
  setFormStructure: Dispatch<SetStateAction<ETree | undefined>>;
};

const ItemHeader: FC<ItemHeaderProps> = ({ container, nodeData, formStructure, setFormStructure }) => {
  const classes = useStyles();

  const handleMouseEnter = () => {
    container?.current?.setAttribute('draggable', 'true');
  };

  const handleMouseLeave = () => {
    container?.current?.setAttribute('draggable', 'false');
  };

  return (
    <CardHeader
      title={
        <div className={classes.cardHeader}>
          <span className={classes.cardHeaderItem}>
            {nodeData[Constants.RDFS_LABEL] || nodeData['@id']} {nodeData[Constants.HAS_PRECEDING_QUESTION] && '^'}
          </span>
          <span className={`${classes.cardHeaderItem} ${classes.cardHeaderItemCenter}`}>
            <DragHandle
              className={classes.cardHeaderDrag}
              focusable={true}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </span>
          <span className={`${classes.cardHeaderItem} ${classes.cardHeaderItemRight}`}>
            <MenuQuestionItem formStructure={formStructure} setFormStructure={setFormStructure} question={nodeData} />
          </span>
        </div>
      }
      disableTypography={true}
    />
  );
};

export default ItemHeader;

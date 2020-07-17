import React, { FC } from 'react';
import useStyles from './ItemHeader.styles';
import { Constants } from 's-forms';
import { DragHandle, MoreVert } from '@material-ui/icons';
import { CardHeader } from '@material-ui/core';
import { ENodeData } from '../../model/ENode';

type ItemHeaderProps = {
  container: React.MutableRefObject<HTMLLIElement | null>;
  nodeData: ENodeData;
};

const ItemHeader: FC<ItemHeaderProps> = ({ container, nodeData }) => {
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
          <span className={classes.cardHeaderItem}>{nodeData[Constants.RDFS_LABEL] || nodeData['@id']}</span>
          <span className={`${classes.cardHeaderItem} ${classes.cardHeaderItemCenter}`}>
            <DragHandle
              className={classes.cardHeaderDrag}
              focusable={true}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </span>
          <span className={`${classes.cardHeaderItem} ${classes.cardHeaderItemRight}`}>
            <MoreVert />
          </span>
        </div>
      }
      disableTypography={true}
    />
  );
};

export default ItemHeader;

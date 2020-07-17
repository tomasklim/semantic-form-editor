import React, { FC, useRef } from 'react';
import { ENodeData } from '../../model/ENode';
import { Constants } from 's-forms';
import useStyles from './EditorItem.styles';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { DragHandle, MoreVert } from '@material-ui/icons';

type Props = {
  data: ENodeData;
};

const EditorItem: FC<Props> = ({ data }) => {
  const classes = useStyles();
  const liContainer = useRef(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '0.4';

    document
      .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
      .forEach((element) => (element.style.pointerEvents = 'none'));

    document.querySelectorAll('[data-droppable=true]').forEach((element) => (element.style.pointerEvents = 'all'));

    e.dataTransfer.setData((e.target as HTMLLIElement).id, '');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.opacity = '1';

    document.querySelectorAll('*').forEach((element) => (element.style.pointerEvents = 'all'));

    [].forEach.call(document.querySelectorAll('li'), (li: HTMLLIElement) => {
      li.classList.remove(classes.over);
    });
  };

  const handleMouseEnter = () => {
    liContainer.current.setAttribute('draggable', 'true');
  };

  const handleMouseLeave = () => {
    liContainer.current.setAttribute('draggable', 'false');
  };

  return (
    <React.Fragment>
      <li
        id={data['@id']}
        className={classes.listItem}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        ref={liContainer}
      >
        <Card variant="outlined">
          <CardHeader
            title={
              <div className={classes.cardHeader}>
                <span className={classes.cardHeaderItem}>{data[Constants.RDFS_LABEL] || data['@id']}</span>
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
          <CardContent>kuk</CardContent>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default EditorItem;

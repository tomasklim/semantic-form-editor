import { DragHandle } from '@material-ui/icons';
import React, { useRef } from 'react';

const DraggableHandle = (props) => {
  const liContainer = useRef(null);

  const handleMouseEnter = () => {
    liContainer.current.setAttribute('draggable', 'true');
  };

  const handleMouseLeave = () => {
    liContainer.current.setAttribute('draggable', 'false');
  };

  return <DragHandle focusable={true} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props} />;
};

export default DraggableHandle;

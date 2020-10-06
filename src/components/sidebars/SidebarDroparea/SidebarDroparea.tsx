import React, { useContext, useRef } from 'react';
import useStyles from './SidebarDroparea.styles';
import { enableNotDraggableAndDroppable, isSectionOrWizardStep } from '@utils/itemDragHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';

const SidebarDroparea: React.FC = () => {
  const classes = useStyles();

  const unorderedDropArea = useRef<HTMLDivElement | null>(null);

  const { formStructure, moveNodeUnderNode, isWizardless } = useContext(FormStructureContext);
  const { intl } = useContext(EditorContext);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      e.preventDefault();

      (e.target as HTMLDivElement).style.opacity = '1';

      enableNotDraggableAndDroppable();

      unorderedDropArea.current!.classList.remove(classes.unorderedDropAreaHighlight);
      document.getElementById('question-drop-area')!.style.display = 'none';

      const movingNodeId = e.dataTransfer.types.slice(-1)[0];
      const targetNodeId = formStructure.getRoot().data['@id'];

      if (!targetNodeId || !movingNodeId) {
        console.warn('Missing targetNodeId or movingNodeId');
        return;
      }

      moveNodeUnderNode(movingNodeId, targetNodeId, true, intl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);

      if (!isWizardless && !isSectionOrWizardStep(movingNode)) {
        return;
      }

      unorderedDropArea.current!.classList.add(classes.unorderedDropAreaHighlight);

      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      unorderedDropArea.current!.classList.remove(classes.unorderedDropAreaHighlight);
    }
  };

  return (
    <div
      data-droppable={true}
      id="question-drop-area"
      ref={unorderedDropArea}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={classes.unorderedDropArea}
    >
      Drop here for unordered top level question
    </div>
  );
};

export default SidebarDroparea;

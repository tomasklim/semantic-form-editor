import React from 'react';
import { FormUtils } from 's-forms';
import FormStructureNode from '@model/FormStructureNode';

export const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
  e.stopPropagation();

  (e.target as HTMLLIElement).style.opacity = '0.4';

  disableNotDraggableAndDroppable();

  enableDraggableAndDroppable();

  e.dataTransfer.clearData();

  e.dataTransfer.setData((e.target as HTMLLIElement).id, '');
};

export const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
  e.stopPropagation();

  (e.target as HTMLLIElement).style.opacity = '1';

  document.querySelectorAll('*').forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'all'));
};

export const disableNotDraggableAndDroppable = () => {
  document
    .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
    .forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'none'));
};

export const enableNotDraggableAndDroppable = () => {
  document
    .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
    .forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'all'));
};

export const enableDraggableAndDroppable = () => {
  document
    .querySelectorAll('[data-droppable=true],[draggable=true]')
    .forEach((el) => ((el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'all'));
};

export const isSectionOrWizardStep = (movingNode: FormStructureNode | undefined) => {
  return movingNode && (FormUtils.isSection(movingNode.data) || FormUtils.isWizardStep(movingNode.data));
};

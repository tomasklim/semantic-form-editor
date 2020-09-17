import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import AddIcon from '@material-ui/icons/Add';
import React, { useContext, useRef } from 'react';
import { NEW_WIZARD_ITEM } from '../../../constants';
import { CustomiseItemContext, OnSaveCallback } from '@contexts/CustomiseItemContext';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './SidebarWizardStep.styles';
import { enableNotDraggableAndDroppable } from '@utils/itemDragHelpers';
import { FormUtils } from 's-forms';

const SidebarWizardStep = ({}) => {
  const classes = useStyles();

  const addButton = useRef<HTMLButtonElement | null>(null);
  const unorderedDropArea = useRef<HTMLDivElement | null>(null);

  const { getClonedFormStructure, addNewNode, formStructure, moveNodeUnderNode } = useContext(FormStructureContext);

  const { customiseItemData } = useContext(CustomiseItemContext);

  const addNewPage = () => {
    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.error('Missing root', clonedFormStructure);
      return;
    }

    customiseItemData({
      itemData: NEW_WIZARD_ITEM,
      onSave: (): OnSaveCallback => (itemData) => addNewNode(itemData, root, clonedFormStructure),
      onCancel: () => () => addButton.current?.classList.remove(classes.buttonHighlight),
      onInit: () => addButton.current?.classList.add(classes.buttonHighlight),
      isNew: true
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      e.preventDefault();

      (e.target as HTMLDivElement).style.opacity = '1';

      enableNotDraggableAndDroppable();

      unorderedDropArea.current!.classList.remove(classes.unorderedDropAreaHighlight);

      const destinationNodeId = formStructure.getRoot().data['@id'];
      const movingNodeId = e.dataTransfer.types.slice(-1)[0];

      if (!destinationNodeId || !movingNodeId) {
        console.warn('Missing destinationPageId or movingNodeId');
        return;
      }

      moveNodeUnderNode(movingNodeId, destinationNodeId, true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.unorderedDropArea)) {
      const movingNode = formStructure.getNode(e.dataTransfer.types.slice(-1)[0]);
      const targetNode = formStructure.getRoot();

      // TODO make function
      if (
        movingNode &&
        targetNode &&
        !FormUtils.isSection(movingNode.data) &&
        !FormUtils.isWizardStep(movingNode.data)
      ) {
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
    <>
      <CustomisedOutlineButton
        onClick={addNewPage}
        title={'Add new wizard step'}
        ref={addButton}
        className={classes.addPageButton}
        startIcon={<AddIcon />}
        variant="outlined"
      >
        Add new wizard step
      </CustomisedOutlineButton>
      <div
        data-droppable={true}
        id="unordered-wizard-step-drop-area"
        ref={unorderedDropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={classes.unorderedDropArea}
      >
        TODO: Drop here for unordered wizard step
      </div>
    </>
  );
};

export default SidebarWizardStep;

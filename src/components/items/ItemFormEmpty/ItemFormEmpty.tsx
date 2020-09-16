import React, { FC, useContext, useRef } from 'react';
import useStyles, { CustomisedAccordionDetails } from './ItemFormEmpty.styles';
import { Accordion } from '@material-ui/core';
import { FormStructureContext } from '@contexts/FormStructureContext';
import AddIcon from '@material-ui/icons/Add';
import { CustomiseItemContext, OnSaveCallback } from '@contexts/CustomiseItemContext';
import { NEW_WIZARD_ITEM } from '../../../constants';

type ItemFormEmptyProps = {};

const ItemFormEmpty: FC<ItemFormEmptyProps> = ({}) => {
  const classes = useStyles();
  const itemFormEmptyContainer = useRef<HTMLDivElement | null>(null);

  const { getClonedFormStructure, addNewNode } = useContext(FormStructureContext);
  const { customiseItemData } = useContext(CustomiseItemContext);

  const addNewPage = (e: React.MouseEvent) => {
    e.stopPropagation();

    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.error('Missing root', clonedFormStructure);
      return;
    }

    customiseItemData({
      itemData: NEW_WIZARD_ITEM,
      onSave: (): OnSaveCallback => (itemData) => addNewNode(itemData, root, clonedFormStructure),
      onCancel: () => () => itemFormEmptyContainer.current?.classList.remove(classes.pageHighlight),
      onInit: () => itemFormEmptyContainer.current?.classList.add(classes.pageHighlight),
      isNew: true
    });
  };

  return (
    <div className={classes.page} ref={itemFormEmptyContainer}>
      <Accordion expanded={true} className={classes.accordion} onClick={addNewPage} title={'Add new wizard step'}>
        <CustomisedAccordionDetails>
          <AddIcon />
        </CustomisedAccordionDetails>
      </Accordion>
    </div>
  );
};

export default ItemFormEmpty;

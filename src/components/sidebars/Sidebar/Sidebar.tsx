import { Drawer } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CustomiseItemContext, OnSaveCallback } from '@contexts/CustomiseItemContext';
import { FormStructureContext } from '@contexts/FormStructureContext';
import AddIcon from '@material-ui/icons/Add';
import { NEW_WIZARD_ITEM } from '../../../constants';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import SidebarItemForm from '@components/sidebars/SidebarItemForm/SidebarItemForm';

// Header + Stepper
const INITIAL_TOP = 60 + 88;

const Sidebar = () => {
  const classes = useStyles();

  const sidebarContainer = useRef<HTMLDivElement | null>(null);
  const addButton = useRef<HTMLButtonElement | null>(null);

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);

  const { getClonedFormStructure, addNewNode } = useContext(FormStructureContext);

  const { customiseItemData, reset } = useContext(CustomiseItemContext);

  // sidebar top position
  useEffect(() => {
    document.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop >= 0) {
        const drawerTop = INITIAL_TOP - scrollTop;
        setDrawerTop(drawerTop > 0 ? drawerTop : 0);
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // @ts-ignore
      if (!sidebarContainer.current?.contains(e.target)) {
        reset();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarContainer, reset]);

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

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="right"
      classes={{
        paper: classes.drawerPaper
      }}
      style={{
        top: `${drawerTop}px`
      }}
      ref={sidebarContainer}
    >
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

      <SidebarItemForm />
    </Drawer>
  );
};

export default Sidebar;

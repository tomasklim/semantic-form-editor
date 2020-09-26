import { Drawer } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';
import SidebarItemForm from '@components/sidebars/SidebarItemForm/SidebarItemForm';
import SidebarWizardStep from '@components/sidebars/SidebarWizardStep/SidebarWizardStep';

// Header + Stepper
const INITIAL_TOP = 60 + 88;

const Sidebar = () => {
  const classes = useStyles();

  const sidebarContainer = useRef<HTMLDivElement | null>(null);

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);

  const { reset } = useContext(CustomiseItemContext);

  // sidebar top position
  useEffect(() => {
    document.addEventListener('scroll', calculateSidebarTopPosition);
    return document.removeEventListener('scroll', calculateSidebarTopPosition);
  }, []);

  const calculateSidebarTopPosition = () => {
    document.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop >= 0) {
        const drawerTop = INITIAL_TOP - scrollTop;
        setDrawerTop(drawerTop > 0 ? drawerTop : 0);
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation();
      // @ts-ignore
      if (!sidebarContainer.current?.contains(e.target) && !e.target.matches('[class^="MuiAutocomplete"]')) {
        reset();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarContainer, reset]);

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
      <SidebarWizardStep />

      <SidebarItemForm />
    </Drawer>
  );
};

export default Sidebar;

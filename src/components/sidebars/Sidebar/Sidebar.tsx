import { Drawer } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import SidebarItemForm from '@components/sidebars/SidebarItemForm/SidebarItemForm';
import SidebarNav from '@components/sidebars/SidebarNav/SidebarNav';
import SidebarResizer from '@components/sidebars/SidebarResizer/SidebarResizer';

// Header + Stepper
const INITIAL_TOP = 88;

const Sidebar = () => {
  const classes = useStyles();

  const sidebarContainer = useRef<HTMLDivElement>();

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);

  const { customiseQuestion, resetCustomisationProcess } = useContext(CustomiseQuestionContext);

  const calculateSidebarTopPosition = () => {
    const scrollTop = document.documentElement.scrollTop;
    const questionContainer = document.getElementById('question-container');

    if (scrollTop >= 0) {
      const drawerTop = INITIAL_TOP - scrollTop;
      setDrawerTop(drawerTop > 0 ? drawerTop : 0);

      if (questionContainer) {
        questionContainer.style.maxHeight = `calc(100vh - ${Math.max(drawerTop, 0) + 112}px)`;
      }
    }
  };

  // sidebar top position
  useEffect(() => {
    document.addEventListener('scroll', () => calculateSidebarTopPosition());
    return document.removeEventListener('scroll', () => calculateSidebarTopPosition());
  }, []);

  useEffect(() => {
    calculateSidebarTopPosition();
  }, [customiseQuestion]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation();
      // @ts-ignore
      if (!sidebarContainer.current?.contains(e.target) && !e.target.matches('[class^="MuiAutocomplete"]')) {
        resetCustomisationProcess();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarContainer, resetCustomisationProcess]);

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
      <SidebarResizer sidebarContainer={sidebarContainer} />

      <SidebarNav />

      <SidebarItemForm />
    </Drawer>
  );
};

export default Sidebar;

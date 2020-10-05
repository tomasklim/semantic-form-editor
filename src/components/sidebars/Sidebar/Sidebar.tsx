import { Drawer } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import SidebarItemForm from '@components/sidebars/SidebarItemForm/SidebarItemForm';
import SidebarWizardStep from '@components/sidebars/SidebarWizardStep/SidebarWizardStep';
import { LOCAL_STORAGE_SIDEBAR_WIDTH } from '../../../constants';

// Header + Stepper
const INITIAL_TOP = 60 + 88;

const Sidebar = () => {
  const classes = useStyles();

  const sidebarContainer = useRef<HTMLDivElement | null>(null);
  const resizer = useRef<HTMLDivElement | null>(null);

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);

  const { resetCustomisationProcess } = useContext(CustomiseQuestionContext);

  useEffect(() => {
    let x = 0;

    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.querySelectorAll('*').forEach((el) => {
        (el as HTMLDivElement | HTMLLIElement).style.pointerEvents = 'none';
        (el as HTMLDivElement | HTMLLIElement).style.cursor = 'ew-resize';
      });
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = x - e.clientX;
      x = e.clientX;

      const form: HTMLDivElement | null = document.querySelector('#form');

      if (!form || !sidebarContainer?.current) {
        return;
      }

      const width = Math.min(
        Math.max(sidebarContainer.current.getBoundingClientRect().width + dx, 400),
        window.innerWidth / 2
      );

      sidebarContainer.current.style.width = `${width}px`;

      form.style.marginRight = `${width + 14}px`;

      localStorage.setItem(LOCAL_STORAGE_SIDEBAR_WIDTH, String(width));
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.querySelectorAll('*').forEach((el) => {
        (el as HTMLDivElement | HTMLLIElement).style.removeProperty('pointer-events');
        (el as HTMLDivElement | HTMLLIElement).style.removeProperty('cursor');
      });
    };

    const localStorageSavedWidth = localStorage.getItem(LOCAL_STORAGE_SIDEBAR_WIDTH);
    if (localStorageSavedWidth) {
      const form: HTMLDivElement | null = document.querySelector('#form');

      sidebarContainer!.current!.style.width = `${localStorageSavedWidth}px`;
      form!.style.marginRight = `${Number(localStorageSavedWidth) + 14}px`;
    }

    resizer!.current!.addEventListener('mousedown', mouseDownHandler);

    return () => resizer!.current!.removeEventListener('mousedown', mouseDownHandler);
  }, [resizer.current, sidebarContainer?.current]);

  // sidebar top position
  useEffect(() => {
    const calculateSidebarTopPosition = () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop >= 0) {
        const drawerTop = INITIAL_TOP - scrollTop;
        setDrawerTop(drawerTop > 0 ? drawerTop : 0);
      }
    };

    document.addEventListener('scroll', () => calculateSidebarTopPosition());
    document.addEventListener('scroll', () => calculateSidebarTopPosition());
    return document.removeEventListener('scroll', () => calculateSidebarTopPosition());
  }, []);

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
      <div className={classes.resizer} id="resizer" ref={resizer} />

      <SidebarWizardStep />

      <SidebarItemForm />
    </Drawer>
  );
};

export default Sidebar;

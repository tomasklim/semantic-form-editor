import React, { useEffect, useRef } from 'react';
import useStyles from './SidebarResizer.styles';
import { LOCAL_STORAGE_SIDEBAR_WIDTH } from '@constants/index';

interface SidebarResizerProps {
  sidebarContainer: React.MutableRefObject<HTMLDivElement | undefined>;
}

const SidebarResizer: React.FC<SidebarResizerProps> = ({ sidebarContainer }) => {
  const classes = useStyles();

  const resizer = useRef<HTMLDivElement | null>(null);

  // resizer
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
        Math.max(sidebarContainer.current.getBoundingClientRect().width + dx, 490),
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
    const form: HTMLDivElement | null = document.querySelector('#form');

    sidebarContainer!.current!.style.width = `${localStorageSavedWidth || 490}px`;
    form!.style.marginRight = `${Number(localStorageSavedWidth || 490) + 14}px`;

    resizer!.current!.addEventListener('mousedown', mouseDownHandler);

    return () => resizer!.current!.removeEventListener('mousedown', mouseDownHandler);
  }, [resizer.current, sidebarContainer?.current]);

  return <div className={classes.resizer} id="resizer" ref={resizer} />;
};

export default SidebarResizer;

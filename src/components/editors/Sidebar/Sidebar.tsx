import { Drawer } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import { useEffect, useState } from 'react';

// Header + Stepper
const INITIAL_TOP = 60 + 88;

const Sidebar = () => {
  const classes = useStyles();

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop >= 0) {
        const drawerTop = INITIAL_TOP - scrollTop;
        setDrawerTop(drawerTop > 0 ? drawerTop : 0);
      }
    });
  }, []);

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
    >
      Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar
      Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar Sidebar
      Sidebar Sidebar Sidebar Sidebar
    </Drawer>
  );
};

export default Sidebar;

import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  drawer: {
    width: `calc(${theme.custom.sidebarWidth} - 14px)`,
    position: 'fixed',
    right: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      pointerEvents: 'none !important'
    }
  },
  drawerPaper: {
    width: 'inherit',
    top: 'inherit',
    height: 'auto',
    marginTop: theme.spacing(3),
    borderLeft: 0,
    color: 'white',
    marginRight: theme.spacing(2),
    backgroundColor: 'transparent'
  },
  drawerContainer: {
    overflow: 'auto'
  },
  emptySidebar: {
    fontStyle: 'italic',
    color: '#ffffffcc'
  }
}));

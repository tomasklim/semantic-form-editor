import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  drawer: {
    width: theme.custom.sidebarWidth,
    position: 'fixed',
    right: 0,
    // TODO
    '& .MuiOutlinedInput-notchedOutline': {
      pointerEvents: 'none !important'
    }
  },
  drawerPaper: {
    width: 'inherit',
    top: 'inherit',
    borderBottomLeftRadius: '2px',
    borderTopLeftRadius: '2px',
    height: 'auto',
    marginTop: '10px',
    borderLeft: 0,
    padding: theme.spacing(1.75, 2),
    // backgroundColor: theme.palette.custom[800],
    color: 'white'
  },
  drawerContainer: {
    overflow: 'auto'
  },
  newItemDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  }
}));

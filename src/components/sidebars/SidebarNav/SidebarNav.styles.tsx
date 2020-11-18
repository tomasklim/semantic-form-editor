import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  buttonHighlight: {
    '&.MuiButton-outlined': {
      backgroundColor: theme.palette.custom.main,
      color: 'white'
    }
  },
  sidebarNav: {
    marginBottom: theme.spacing(1.5),
    '&.MuiButton-outlined': {
      width: 'fit-content',
      border: '2px solid ' + theme.palette.custom.main
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiButton-outlined.Mui-disabled': {
      border: '1px solid rgb(255 255 255 / 12%)'
    },
    '& .MuiButton-root.Mui-disabled': {
      color: 'rgb(255 255 255 / 26%)'
    }
  },
  sidebarNavLeft: {
    marginRight: 'auto',
    '& > :not(:first-child)': {
      marginLeft: theme.spacing(1)
    },
    '& #errors-list-button': {
      marginLeft: 0
    }
  },
  expandButton: {
    minWidth: 'fit-content',
    padding: '5px 10px'
  },
  codeButton: {
    minWidth: 'fit-content',
    padding: '5px 10px'
  },
  spellCheckButton: {
    minWidth: 'fit-content',
    padding: '5px 10px',
    marginRight: 'auto'
  }
}));

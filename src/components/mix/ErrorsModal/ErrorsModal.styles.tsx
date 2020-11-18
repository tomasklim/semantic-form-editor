import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';
import { red } from '@material-ui/core/colors';

export default makeStyles((theme: ITheme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    '& > div:first-of-type': {
      backgroundColor: 'rgba(0, 0, 0, 0.7) !important'
    }
  },
  paper: {
    position: 'absolute',
    maxHeight: '80vh',
    overflow: 'auto',
    top: '108px',
    maxWidth: '90vw',

    backgroundColor: theme.palette.custom[900],
    border: '1px solid ' + theme.palette.custom.main,
    borderRadius: '4px',
    padding: theme.spacing(3, 4, 3),
    '& h3': {
      marginBottom: theme.spacing(4)
    },
    '&:focus': {
      outline: 'none'
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(5),
    '& button': {
      width: '200px'
    }
  },
  copyIcon: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.custom.main
    }
  },
  errorsListButton: {
    color: red[500],
    '&:hover': {
      color: red[400]
    }
  }
}));

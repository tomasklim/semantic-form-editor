import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  newFormButtons: {
    color: '#ffffffa6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& button, & span': {
      margin: theme.spacing(0.5)
    },
    '& label': {
      margin: 0
    }
  },
  italic: {
    fontStyle: 'italic'
  },
  continueButtons: {
    color: '#ffffffa6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3),
    '& span': {
      margin: theme.spacing(0.5)
    }
  },
  uploadFileInput: {
    display: 'none'
  },
  buttonWidth: {
    minWidth: '250px'
  }
}));

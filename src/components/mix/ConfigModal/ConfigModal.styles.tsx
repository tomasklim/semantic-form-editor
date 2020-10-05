import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  config: {},
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    position: 'absolute',
    width: 600,
    top: '170px',
    backgroundColor: 'white',
    border: '2px solid ' + theme.palette.custom.main,
    padding: theme.spacing(2, 4, 3),
    '& h2': {
      marginBottom: '1.5rem'
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem'
  }
}));

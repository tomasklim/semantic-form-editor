import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';

export default makeStyles((theme: ITheme) => ({
  footer: {
    padding: theme.spacing(1),
    marginTop: 'auto',
    textAlign: 'center',
    color: 'white'
  }
}));

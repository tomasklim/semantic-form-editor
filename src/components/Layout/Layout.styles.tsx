import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';

export default makeStyles((theme: ITheme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: 0,
    backgroundColor: theme.palette.custom[900]
  }
}));

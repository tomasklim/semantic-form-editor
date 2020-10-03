import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: 0,
    backgroundColor: theme.palette.custom[900]
  },
  '@global html, body': {
    backgroundColor: theme.palette.custom[900]
  }
}));

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: 0,
    backgroundColor: theme.palette.primary.dark
  }
}));

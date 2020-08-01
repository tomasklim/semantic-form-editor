import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  page: {
    border: '1px solid transparent',
    margin: theme.spacing(1, 2)
  },
  pageOver: {
    border: '1px dashed red'
  },
  newPage: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

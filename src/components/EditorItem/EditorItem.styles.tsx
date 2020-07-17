import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1),
    width: '100%',
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: 'gray'
    }
  }
}));

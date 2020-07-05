import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1.5),
    width: 'fit-content',
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: 'gray'
    }
  },
  over: {
    border: '1px dashed red'
  }
}));

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  listItem: {
    width: '100%',
    border: '2px solid transparent',
    '&:hover': {
      border: '2px dashed #5a81ea'
    }
  },
  card: {
    // @ts-ignore
    backgroundColor: theme.palette.primary[100],
    color: theme.palette.primary.contrastText
  }
}));

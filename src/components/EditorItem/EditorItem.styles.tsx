import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  listItem: {
    padding: 10,
    width: 'fit-content',
    '&:hover': {
      backgroundColor: 'gray'
    }
  },
  over: {
    border: '1px solid red',
    backgroundColor: 'orange'
  }
}));

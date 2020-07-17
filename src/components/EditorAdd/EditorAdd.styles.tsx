import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  addLine: {
    height: '20px',
    '& svg': {
      display: 'none'
    },
    '&:hover': {
      backgroundColor: 'red',
      '& svg': {
        display: 'flex'
      }
    }
  },
  over: {
    backgroundColor: 'red',
    '& svg': {
      display: 'flex'
    }
  }
}));

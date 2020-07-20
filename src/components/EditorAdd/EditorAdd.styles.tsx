import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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
  overAdd: {
    backgroundColor: 'red',
    '& svg': {
      display: 'flex'
    }
  }
}));

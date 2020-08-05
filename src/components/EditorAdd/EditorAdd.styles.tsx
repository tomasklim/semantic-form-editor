import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  addLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  addLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '15px',
    margin: '2px 3px',
    '& svg': {
      transform: 'scale(0)',
      transitionDelay: '0',
      transitionDuration: '0.2s',
      transitionProperty: 'transform',
      color: '#5a81ea'
    },
    transitionDelay: '0.1s',
    transitionDuration: '0.5s',
    transitionProperty: 'height',
    '&:hover': {
      border: '2px dashed #5a81ea',
      height: '40px',
      transitionDelay: '0.5s',
      '& svg': {
        transitionDelay: '0.5s',
        transitionDuration: '0.5s',
        transform: 'scale(1)'
      }
    }
  }, // remove duplicate
  overAdd: {
    border: '2px dashed #5a81ea',
    height: '40px',
    transitionDelay: '0.5s',
    '& svg': {
      transitionDelay: '0.5s',
      transitionDuration: '0.5s',
      transform: 'scale(1)'
    }
  }
}));

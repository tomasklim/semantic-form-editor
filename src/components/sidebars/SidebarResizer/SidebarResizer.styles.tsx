import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  resizer: {
    height: 'calc(100vh - 210px)',
    width: '5px',
    position: 'absolute',
    cursor: 'ew-resize',
    left: '-10px'
  }
}));

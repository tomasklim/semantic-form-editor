import { makeStyles } from '@material-ui/core/styles';
import { red, yellow } from '@material-ui/core/colors';

export default makeStyles(() => ({
  headerIndicators: {
    display: 'flex',
    marginLeft: '1rem',
    '& div': {
      width: '14px'
    }
  },
  required: {
    '& span': {
      backgroundColor: red[300]
    }
  },
  preceding: {
    '& span': {
      backgroundColor: yellow[300]
    }
  }
}));

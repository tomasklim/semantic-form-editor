import { makeStyles } from '@material-ui/core/styles';
import { green, red, purple } from '@material-ui/core/colors';

export default makeStyles(() => ({
  headerIndicators: {
    display: 'flex',
    marginLeft: '1rem',
    cursor: 'grab',
    '& div': {
      width: '18px',
      height: '24px'
    },
    '& .MuiBadge-badge': {
      padding: 0,
      height: '14px',
      minWidth: '14px'
    },
    '& .MuiSvgIcon-fontSizeSmall': {
      fontSize: '0.85rem'
    }
  },
  required: {
    '& span': {
      backgroundColor: red[300]
    }
  },
  preceding: {
    '& span': {
      backgroundColor: purple[300],
      cursor: 'pointer',
      '& .MuiSvgIcon-fontSizeSmall': {
        fontSize: '0.75rem'
      }
    }
  },
  collapsable: {
    '& span': {
      backgroundColor: green[300]
    }
  }
}));

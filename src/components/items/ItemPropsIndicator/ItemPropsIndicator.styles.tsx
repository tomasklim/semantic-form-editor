import { makeStyles } from '@material-ui/core/styles';
import { green, red, purple, brown } from '@material-ui/core/colors';

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
      backgroundColor: red[500]
    }
  },
  preceding: {
    '& span': {
      backgroundColor: purple[500],
      cursor: 'pointer',
      '& .MuiSvgIcon-fontSizeSmall': {
        fontSize: '0.75rem'
      }
    }
  },
  collapsable: {
    '& span': {
      backgroundColor: green[500]
    }
  },
  helpDescription: {
    '& span': {
      backgroundColor: brown[900]
    }
  },
  comment: {
    '& span': {
      backgroundColor: green[900],
      '& .MuiSvgIcon-fontSizeSmall': {
        fontSize: '0.65rem'
      }
    }
  }
}));

import { makeStyles } from '@material-ui/core/styles';
import { amber, brown, green, purple, red, teal } from '@material-ui/core/colors';

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
      backgroundColor: green[500]
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
      cursor: 'pointer',
      '& .MuiSvgIcon-fontSizeSmall': {
        fontSize: '0.65rem'
      }
    }
  },
  inputMask: {
    '& span': {
      backgroundColor: teal[900],
      fontSize: '0.55rem'
    }
  },
  disabled: {
    '& span': {
      backgroundColor: amber[900],
      '& .MuiSvgIcon-fontSizeSmall': {
        fontSize: '0.65rem'
      }
    }
  },
  optionsQuery: {
    '& span': {
      backgroundColor: teal[900],
      fontSize: '0.55rem'
    }
  },
  validationErrors: {
    color: red[500],
    fontSize: '0.55rem',
    width: 'auto',
    height: 'auto',
    marginRight: '1.3rem',
    marginLeft: '-0.4rem'
  },
  tooltipNowrap: {
    marginLeft: '13px',
    '& > div': {
      maxWidth: '100%',
      fontSize: '0.8rem',
      padding: '0.5rem 0.5rem',
      fontWeight: 400,
      '& > div': {
        padding: '0.3rem'
      }
    }
  }
}));

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  itemContent: {
    cursor: 'pointer',
    '& input, & textarea': {
      backgroundColor: 'transparent',
      color: 'white',
      border: '1px solid white',
      borderRadius: '3px',
      padding: '0.5rem 0.8rem',
      fontSize: '1rem',
      resize: 'none',
      width: 205
    },
    '& input::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)'
    }
  },
  checkbox: {
    display: 'inline-flex',
    fontSize: '1rem',
    alignItems: 'center',
    fontWeight: 400,
    '& > div': {
      height: '1.2rem',
      width: '1.2rem',
      border: '2px solid white',
      borderRadius: '3px',
      marginRight: '0.5rem'
    }
  },
  typeaheadArrow: {
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid white',
    marginTop: -22,
    marginLeft: 185,
    position: 'absolute'
  }
}));

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  previewConfig: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '1rem',
    '&>:not(:first-child)': {
      marginLeft: '2rem'
    },
    '& .MuiFormControl-root': {
      width: '69px'
    },
    '& .MuiInputLabel-root': {
      color: 'white',
      fontWeight: 500,
      fontSize: '0.875rem'
    },
    '& .MuiInputLabel-shrink': {
      marginTop: '4px',
      transform: 'translate(0, 1.5px) scale(1);'
    },
    '& .MuiInputBase-root': {
      color: 'white',
      width: 'fit-content',
      alignSelf: 'center'
    },
    '& .MuiSelect-icon': {
      color: 'white'
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
      display: 'none'
    },
    '& .Mui-focused:after': {
      display: 'none'
    },
    '& label + .MuiInput-formControl': {
      marginTop: '22px'
    }
  }
}));

import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  previewContainer: {
    margin: theme.spacing(1, 2),
    '& > div': {
      borderRadius: '2px'
    }
  },
  previewConfig: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    }
  }
}));

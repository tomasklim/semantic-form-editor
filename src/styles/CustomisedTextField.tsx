import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '../interfaces';
import { TextField } from '@material-ui/core';

// @ts-ignore
export const CustomisedTextField = withStyles((theme: ITheme) => ({
  root: {
    '& *': {
      pointerEvents: 'none  !important'
    },
    '& .MuiInputBase-root input': {
      color: 'white'
    },
    '& .MuiInputBase-root textarea': {
      color: 'white'
    },
    '& input::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white'
    },
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1.5)
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 0
    }
  }
}))(TextField);

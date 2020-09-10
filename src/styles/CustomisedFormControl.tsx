import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '../interfaces';
import { FormControl } from '@material-ui/core';

// @ts-ignore
export const CustomisedFormControl = withStyles((theme: ITheme) => ({
  root: {
    '&, & *': {
      pointerEvents: 'none  !important'
    },
    '& .MuiInputLabel-root': {
      color: 'white'
    },
    '& .MuiSelect-select.MuiSelect-select': {
      width: 140
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 14px) scale(1)'
    },
    '& .MuiSelect-icon': {
      color: 'white'
    },
    '& .MuiIconButton-label': {
      color: 'white'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white'
    },
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1.5)
    }
  }
}))(FormControl);

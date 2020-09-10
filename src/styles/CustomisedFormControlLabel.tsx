import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '../interfaces';
import { FormControlLabel } from '@material-ui/core';

// @ts-ignore
export const CustomisedFormControlLabel = withStyles((theme: ITheme) => ({
  root: {
    '& .MuiIconButton-label': {
      color: 'white'
    },
    '& .MuiCheckbox-root': {
      padding: '0 9px'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem'
    }
  }
}))(FormControlLabel);

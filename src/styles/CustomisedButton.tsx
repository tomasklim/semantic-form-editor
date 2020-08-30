import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';
import { Button } from '@material-ui/core';

// @ts-ignore
export const CustomisedButton = withStyles((theme: ITheme) => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.custom.main,
    borderColor: theme.palette.custom.main,
    minWidth: '250px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: 'white',
      color: theme.palette.custom.main
    },
    '&:focus': {
      outline: 'none'
    },
    '&:disabled': {
      color: '#ffffff7a',
      backgroundColor: theme.palette.custom.main + '7a'
    }
  }
}))(Button);

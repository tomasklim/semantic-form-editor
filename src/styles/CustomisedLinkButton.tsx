import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '../interfaces';
import { Button } from '@material-ui/core';

// @ts-ignore
export const CustomisedLinkButton = withStyles((theme: ITheme) => ({
  root: {
    color: 'white',
    borderColor: theme.palette.custom.main,
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.custom.main
    },
    '&:focus': {
      outline: 'none'
    }
  }
}))(Button);

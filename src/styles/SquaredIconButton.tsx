import { IconButton, withStyles } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

// @ts-ignore
const SquaredIconButton = withStyles((theme: ITheme) => ({
  root: {
    color: theme.palette.custom.main,
    borderRadius: '4px',
    border: '2px solid transparent',
    backgroundColor: theme.palette.custom[900] + '99',
    padding: theme.spacing(0.5),
    margin: theme.spacing(0, 0.5),
    '&:hover': {
      backgroundColor: theme.palette.custom[900] + '4d',
      color: theme.palette.custom.light
    },
    '&:focus': {
      outline: 'none'
    }
  }
}))(IconButton);

export default SquaredIconButton;

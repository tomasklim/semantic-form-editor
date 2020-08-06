import { IconButton, withStyles } from '@material-ui/core';

const SquaredIconButton = withStyles((theme) => ({
  root: {
    color: '#5a81ea',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.dark + '99',
    padding: theme.spacing(0.75),
    margin: theme.spacing(0, 0.5),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark + '4d',
      color: '#A2B6EE'
    }
  }
}))(IconButton);

export default SquaredIconButton;

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { Card } from '@material-ui/core';

export default makeStyles(() => ({
  listItem: {
    width: '100%',
    border: '2px solid transparent',
    '&:hover': {
      border: '2px dashed #5a81ea'
    }
  }
}));

export const CustomisedCard = withStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.palette.primary[100],
    color: theme.palette.primary.contrastText
  }
}))(Card);

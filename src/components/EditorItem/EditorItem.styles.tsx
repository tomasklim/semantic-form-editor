import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import { ITheme } from '../../interfaces';

export default makeStyles((theme: ITheme) => ({
  listItem: {
    width: '100%',
    border: '2px solid transparent',
    '&:hover': {
      border: '2px dashed ' + theme.palette.custom.main
    }
  }
}));

// @ts-ignore
export const CustomisedCard = withStyles((theme: ITheme) => ({
  root: {
    color: theme.palette.custom.contrastText
  }
}))(Card);

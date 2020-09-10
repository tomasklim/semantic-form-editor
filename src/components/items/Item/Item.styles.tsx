import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  listItem: {
    width: '100%',
    border: '2px solid transparent'
  },
  listItemHighlight: {
    border: '2px solid ' + theme.palette.custom.main
  },
  '@global .listItemHover': {
    border: '2px dashed ' + theme.palette.custom.main + ' !important'
  }
}));

// @ts-ignore
export const CustomisedCard = withStyles((theme: ITheme) => ({
  root: {
    color: theme.palette.custom.contrastText
  }
}))(Card);

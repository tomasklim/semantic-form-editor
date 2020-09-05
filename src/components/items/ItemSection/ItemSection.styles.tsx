import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  listItemSection: {
    width: '100%',
    border: '2px solid transparent'
  },
  listItemSectionOver: {
    border: '2px dashed ' + theme.palette.custom.main
  },
  ol: {
    listStyle: 'none',
    paddingLeft: '0'
  },
  emptySection: {
    fontStyle: 'italic',
    opacity: 0.6,
    margin: theme.spacing(0),
    padding: theme.spacing(1, 0, 0.5)
  },
  cardContent: {
    padding: theme.spacing(1, 2)
  }
}));

// @ts-ignore
export const CustomisedCard = withStyles((theme: ITheme) => ({
  root: {
    color: theme.palette.custom.contrastText
  }
}))(Card);

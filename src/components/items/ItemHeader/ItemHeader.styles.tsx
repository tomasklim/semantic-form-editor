import { makeStyles, withStyles } from '@material-ui/core/styles';
import { CardHeader } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  cardHeader: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1)
  },
  cardHeaderItemLeft: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      color: theme.palette.custom.main,
      marginRight: theme.spacing(1)
    }
  },
  cardHeaderItemRight: { textAlign: 'right' },
  cardHeaderDrag: {
    color: theme.palette.custom.main,
    marginRight: theme.spacing(1)
  }
}));

// @ts-ignore
export const CustomisedCardHeader = withStyles((theme: ITheme) => ({
  root: {
    borderBottom: '1px solid ' + theme.palette.custom.contrastText + '0f',
    padding: theme.spacing(0),
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing'
    }
  }
}))(CardHeader);

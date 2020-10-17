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
    alignItems: 'center'
  },
  cardHeaderItemRight: { textAlign: 'right' },
  cardHeaderDrag: {
    color: theme.palette.custom.main,
    marginRight: theme.spacing(1)
  },
  expandableSection: {
    marginRight: '0.3rem',
    '&:hover': {
      color: theme.palette.custom.main
    }
  },
  position: {
    marginRight: '0.5rem'
  }
}));

// @ts-ignore
export const CustomisedCardHeader = withStyles((theme: ITheme) => ({
  root: {
    padding: theme.spacing(0),
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing'
    }
  }
}))(CardHeader);

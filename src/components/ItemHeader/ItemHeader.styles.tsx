import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { CardHeader } from '@material-ui/core';

export default makeStyles((theme) => ({
  cardHeader: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardHeaderItemLeft: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      color: '#5a81ea',
      marginRight: theme.spacing(1)
    }
  },
  cardHeaderItemRight: { textAlign: 'right' },
  cardHeaderDrag: {
    color: '#5a81ea',
    marginRight: theme.spacing(1)
  }
}));

export const CustomisedCardHeader = withStyles((theme) => ({
  root: {
    borderBottom: '1px solid #ffffff0f',
    padding: theme.spacing(1, 1, 1, 1),
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing'
    }
  }
}))(CardHeader);

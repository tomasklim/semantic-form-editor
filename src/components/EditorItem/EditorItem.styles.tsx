import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1),
    width: '100%',
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: 'gray'
    }
  },
  over: {
    border: '1px dashed red'
  },
  cardHeader: {
    fontSize: '1rem',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  cardHeaderItem: {
    width: '33%'
  },
  cardHeaderItemRight: { textAlign: 'right' },
  cardHeaderItemCenter: { textAlign: 'center' },
  cardHeaderDrag: {
    cursor: 'move'
  }
}));

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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

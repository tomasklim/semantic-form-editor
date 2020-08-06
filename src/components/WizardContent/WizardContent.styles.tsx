import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  body: {
    flexDirection: 'column',
    cursor: 'pointer',
    padding: theme.spacing(1.5, 2)
  },
  ol: {
    listStyle: 'none',
    paddingLeft: 0,
    margin: 0
  },
  emptyPage: {
    fontStyle: 'italic',
    opacity: 0.6,
    marginLeft: '0.5rem'
  }
}));

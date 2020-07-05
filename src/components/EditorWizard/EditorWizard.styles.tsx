import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  body: {
    flexDirection: 'column'
  },
  header: {
    cursor: 'default !important'
  },
  page: {
    border: '1px solid transparent',
    margin: theme.spacing(1, 2)
  },
  pageOver: {
    border: '1px dashed red'
  },
  panel: {
    pointerEvents: 'none',
    '@global': {
      li: {
        pointerEvents: 'all'
      }
    }
  }
}));

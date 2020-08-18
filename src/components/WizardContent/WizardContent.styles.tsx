import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';

export default makeStyles((theme: ITheme) => ({
  body: {
    flexDirection: 'column',
    cursor: 'pointer',
    padding: theme.spacing(1, 2)
  },
  ol: {
    listStyle: 'none',
    paddingLeft: 0,
    margin: 0,
    '& li div': {
      backgroundColor: theme.palette.custom[600]
    },
    '& ol li div': {
      backgroundColor: theme.palette.custom[500]
    },
    '& ol ol li div': {
      backgroundColor: theme.palette.custom[400]
    },
    '& ol ol ol li div': {
      backgroundColor: theme.palette.custom[300]
    },
    '& ol ol ol ol li div': {
      backgroundColor: theme.palette.custom[200]
    }
  },
  emptyPage: {
    fontStyle: 'italic',
    opacity: 0.6,
    margin: theme.spacing(1.5, 1, 1.5)
  }
}));

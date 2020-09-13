import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  header: {
    cursor: 'pointer',
    '& > div': {
      margin: theme.spacing(1.5, 0) + ' !important'
    }
  },
  wizardHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  wizardHeaderItem: {
    width: '50%'
  },
  wizardHeaderLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  wizardHeaderRight: {
    textAlign: 'right'
  },
  expandablePage: {
    marginRight: '0.3rem',
    '&:hover': {
      color: theme.palette.custom.main
    }
  }
}));

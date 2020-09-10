import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  header: {
    cursor: 'default !important',
    borderBottom: '1px solid ' + theme.palette.custom.contrastText + '0f',
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
  }
}));

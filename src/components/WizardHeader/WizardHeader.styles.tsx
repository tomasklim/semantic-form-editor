import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';

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
    width: '33%'
  },
  wizardHeaderLeft: {
    display: 'flex'
  },
  wizardHeaderCenter: {
    textAlign: 'center'
  },
  wizardHeaderRight: {
    textAlign: 'right'
  }
}));

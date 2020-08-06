import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  header: {
    cursor: 'default !important',
    borderBottom: '1px solid #ffffff0f',
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

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  header: {
    cursor: 'default !important'
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

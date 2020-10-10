import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  jsonEditor: { marginTop: '20px' },
  continueButtons: {
    color: '#ffffffa6',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(3, 2, 0),
    '& span': {
      margin: theme.spacing(0.5)
    }
  },
  codeButton: {
    minWidth: 'fit-content',
    padding: '1px 6px',
    position: 'absolute',
    right: 15
  },
  saveButton: {
    padding: '1px 6px',
    marginRight: '6px',
    marginLeft: 'auto'
  },
  resetButton: {
    padding: '1px 6px',
    marginRight: 'auto'
  },
  validateButton: {
    padding: '1px 6px',
    minWidth: 'fit-content'
  },
  validateContainer: {
    position: 'absolute'
  }
}));

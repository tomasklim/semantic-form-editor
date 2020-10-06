import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  jsonEditor: { marginTop: '20px' },
  continueButtons: {
    color: '#ffffffa6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3),
    '& span': {
      margin: theme.spacing(0.5)
    }
  },
  codeButton: {
    minWidth: 'fit-content',
    padding: '5px 10px'
  }
}));

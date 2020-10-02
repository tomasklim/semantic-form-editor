import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  form: {
    '& > *': {
      width: '100%'
    }
  },
  sidebarButtons: {
    display: 'flex',
    justifyContent: 'center'
  },
  saveButton: {
    width: '90px'
  }
}));

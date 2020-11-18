import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarButtons: {
    display: 'flex'
  },
  saveButton: {
    width: '160px'
  }
}));

import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  addButtonHighlight: {
    border: `2px solid ${theme.palette.custom.main} !important`
  }
}));

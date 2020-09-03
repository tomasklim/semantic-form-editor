import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  container: {
    margin: theme.spacing(1, 2),
    '& > div': {
      borderRadius: '2px'
    }
  }
}));

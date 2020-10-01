import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  previewContainer: {
    margin: theme.spacing(1, 2),
    '& > div': {
      borderRadius: '2px'
    }
  }
}));

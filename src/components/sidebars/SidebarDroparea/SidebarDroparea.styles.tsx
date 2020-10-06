import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  unorderedDropArea: {
    padding: '4rem 1rem',
    textAlign: 'center',
    border: '2px dashed ' + theme.palette.custom[800],
    marginBottom: theme.spacing(1.5),
    userSelect: 'none',
    fontWeight: 500,
    textTransform: 'uppercase',
    color: '#ffffff82'
  },
  unorderedDropAreaHighlight: {
    border: '2px dashed ' + theme.palette.custom.main,
    color: theme.palette.custom.main
  },
  '@global #question-drop-area': {
    display: 'none'
  }
}));

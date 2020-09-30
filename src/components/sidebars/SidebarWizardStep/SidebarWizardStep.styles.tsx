import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  buttonHighlight: {
    '&.MuiButton-outlined': {
      backgroundColor: theme.palette.custom.main,
      color: 'white'
    }
  },
  addPageButton: {
    marginBottom: theme.spacing(1.5),
    '&.MuiButton-outlined': {
      width: 'fit-content',
      border: '2px solid ' + theme.palette.custom.main
    }
  },
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
  '@global #unordered-top-level-question-drop-area': {
    display: 'none'
  }
}));

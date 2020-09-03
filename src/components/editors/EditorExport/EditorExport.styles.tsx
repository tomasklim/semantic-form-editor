import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  container: {
    display: 'flex',
    flex: 0.9,
    margin: theme.spacing(0, 2),
    '@global .jsoneditor': {
      borderColor: theme.palette.custom.main,
      height: 'initial'
    },
    '@global .jsoneditor-menu': {
      backgroundColor: theme.palette.custom.main,
      borderBottom: 0
    },
    '@global .jsoneditor-poweredBy': {
      display: 'none'
    },
    '@global .jsoneditor-sort': {
      display: 'none'
    },
    '@global .jsoneditor-transform': {
      display: 'none'
    },
    '@global .jsoneditor-repair': {
      display: 'none'
    },
    '@global .jsoneditor-compact': {
      display: 'none'
    },
    '@global .jsoneditor-undo': {
      display: 'none'
    },
    '@global .jsoneditor-redo': {
      display: 'none'
    }
  },
  getExportedFormButtons: {
    color: '#ffffffa6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& button, & span': {
      margin: theme.spacing(0.5)
    },
    '& label': {
      margin: 0
    }
  },
  italic: {
    fontStyle: 'italic'
  },
  buildNewFormButtonContainer: {
    color: '#ffffffa6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3),
    '& span': {
      margin: theme.spacing(0.5)
    }
  }
}));

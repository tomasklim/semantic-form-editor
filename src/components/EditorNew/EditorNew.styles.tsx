import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';
import { Button } from '@material-ui/core';

export default makeStyles((theme: ITheme) => ({
  container: {
    display: 'flex',
    flex: 0.5,
    margin: theme.spacing(0, 2),
    '@global .jsoneditor': {
      height: 'initial',
      borderColor: theme.palette.custom.main
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
  newFormButtons: {
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
  uploadFileInput: {
    display: 'none'
  }
}));

// @ts-ignore
export const CustomisedOutlineButton = withStyles((theme: ITheme) => ({
  root: {
    color: theme.palette.custom.main,
    borderColor: theme.palette.custom.main,
    minWidth: '250px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: theme.palette.custom.main,
      color: 'white'
    },
    '&:focus': {
      outline: 'none'
    }
  }
}))(Button);

// @ts-ignore
export const CustomisedButton = withStyles((theme: ITheme) => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.custom.main,
    borderColor: theme.palette.custom.main,
    minWidth: '250px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: 'white',
      color: theme.palette.custom.main
    },
    '&:focus': {
      outline: 'none'
    },
    '&:disabled': {
      color: '#ffffff7a',
      backgroundColor: theme.palette.custom.main + '7a'
    }
  }
}))(Button);

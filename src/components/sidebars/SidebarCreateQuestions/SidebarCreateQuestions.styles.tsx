import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  questionFormContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.custom[800],
    padding: theme.spacing(1.75, 2),
    maxHeight: 'calc(100vh - (60px + 72px + 90px + 40px))', // header + stepperbar + space + footer
    overflow: 'scroll',
    borderBottomLeftRadius: '4px',
    borderBottomTopRadius: '4px',
    '& > *': {
      margin: theme.spacing(1, 0)
    },
    '& .MuiInputBase-input': {
      color: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ffffffa6 !important'
      }
    },
    '& .MuiFormLabel-root': {
      color: '#ffffffcc'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffffa6 !important'
    },
    '& .MuiLink-button': {
      marginTop: 0,
      marginBottom: theme.spacing(2),
      color: theme.palette.custom.main,
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      textDecoration: 'none',
      outline: 'none !important',
      '&:hover': {
        color: 'white'
      },
      '&:focus': {
        color: 'white'
      }
    },
    '& .MuiFormControlLabel-root': {
      width: 'fit-content'
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

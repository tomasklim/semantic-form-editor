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
    borderBottomRightRadius: '4px',
    '& > *': {
      margin: theme.spacing(1, 0)
    },
    '& .MuiInputBase-input': {
      color: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ffffffa6 !important'
      }
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#ffffffcc'
    },
    '& .MuiFormLabel-root': {
      color: '#ffffffcc'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffffa6 !important'
    },
    '&. MuiFormControlLabel-root': {
      width: 'fit-content'
    },
    '& .MuiSelect-icon': {
      color: '#ffffffcc'
    },
    '& .MuiSelect-root option': {
      color: 'initial',
      backgroundColor: 'initial'
    },
    '& .MuiCheckbox-root': { color: '#ffffffcc' },
    '& .MuiCheckbox-colorSecondary:hover, & .MuiCheckbox-colorSecondary.Mui-checked:hover, & .MuiIconButton-root:hover': {
      backgroundColor: theme.palette.custom.main + '2b'
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#ffffffcc'
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
  },
  formHeader: {
    marginTop: '0',
    marginBottom: theme.spacing(2),
    fontWeight: 400,
    color: '#ffffffed',
    width: 'fit-content',
    userSelect: 'none'
  },
  borderRadiusTop: {
    borderTopRightRadius: '4px',
    borderTopLeftRadius: '4px'
  }
}));

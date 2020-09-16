import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  newItemDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.custom[800],
    padding: theme.spacing(1.75, 2),
    borderRadius: '4px',
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
    '& .MuiIconButton-root': {
      padding: '9px 9px 9px 0'
    },
    '& .MuiCheckbox-root': { color: '#ffffffcc' },
    '& .MuiCheckbox-colorSecondary:hover, & .MuiCheckbox-colorSecondary.Mui-checked:hover, & .MuiIconButton-root:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#ffffffcc'
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

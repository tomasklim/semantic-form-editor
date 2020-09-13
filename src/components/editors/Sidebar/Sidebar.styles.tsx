import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  drawer: {
    width: `calc(${theme.custom.sidebarWidth} - 14px)`,
    position: 'fixed',
    right: 0,
    // TODO
    '& .MuiOutlinedInput-notchedOutline': {
      pointerEvents: 'none !important'
    }
  },
  drawerPaper: {
    width: 'inherit',
    top: 'inherit',
    borderRadius: '4px',
    height: 'auto',
    marginTop: '10px',
    borderLeft: 0,
    padding: theme.spacing(1.75, 2),
    // backgroundColor: theme.palette.custom[800],
    color: 'white',
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.custom[800]
  },
  drawerContainer: {
    overflow: 'auto'
  },
  newItemDataContainer: {
    display: 'flex',
    flexDirection: 'column',
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
  },
  emptySidebar: {
    fontStyle: 'italic',
    color: '#ffffffcc'
  }
}));

import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  appBar: {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    backgroundColor: theme.palette.custom[600],
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.custom.main
    },
    '& .MuiButtonBase-root': {
      outline: 'none'
    },
    '&.MuiPaper-elevation4': {
      boxShadow: 'none'
    }
  }
}));

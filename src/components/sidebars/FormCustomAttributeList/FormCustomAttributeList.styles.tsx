import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  genericTextField: {
    '& .MuiInputLabel-root': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '300px',
      direction: 'rtl',
      textAlign: 'left',
      paddingBottom: theme.spacing(0.5)
    },
    '& .MuiInputLabel-shrink': {
      width: '420px'
    },
    '& .MuiIconButton-label': {
      color: 'white'
    },
    '& .MuiIconButton-edgeEnd': {
      outline: 'none !important'
    }
  },
  addNewAttribute: {
    width: 'fit-content'
  }
}));

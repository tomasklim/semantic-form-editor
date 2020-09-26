import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  customAttributeContainer: {
    padding: theme.spacing(1, 2),
    borderRadius: '4px',
    border: '1px solid #ffffff1c',
    '& > *': {
      margin: theme.spacing(1, 0),
      width: '100%'
    }
  },
  addNewAttributeTitle: {
    color: 'white',
    fontWeight: 500,
    marginTop: 0
  },
  addNewAttributeButtons: {
    fontWeight: 500
  }
}));

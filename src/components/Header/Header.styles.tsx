import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';

export default makeStyles((theme: ITheme) => ({
  header: {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    margin: theme.spacing(0, 0, 1),
    borderBottom: '1px solid ' + theme.palette.custom[500],

    '& nav': {
      '& a': {
        color: theme.palette.custom.contrastText,
        textDecoration: 'none',
        fontSize: '15px',
        fontFamily: 'Roboto',
        fontWeight: 500,
        alignItems: 'center',
        display: 'flex',

        '&:hover': {
          color: theme.palette.custom.main
        },

        '& svg': {
          marginRight: '0.2rem'
        }
      }
    }
  }
}));

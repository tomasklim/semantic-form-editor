import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  header: {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    margin: theme.spacing(0, 0, 1),
    // @ts-ignore
    borderBottom: '1px solid ' + theme.palette.primary[200],

    '& nav': {
      '& a': {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
        fontSize: '15px',
        fontFamily: 'Roboto',
        fontWeight: 500,
        alignItems: 'center',
        display: 'flex',

        '&:hover': {
          color: '#5a81ea'
        },

        '& svg': {
          marginRight: '0.2rem'
        }
      }
    }
  }
}));

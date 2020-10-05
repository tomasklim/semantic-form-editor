import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  switchContainer: {
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: '1.1rem',
    margin: theme.spacing(3, 0, 2),
    '& > span': {
      marginBottom: '0.3rem'
    }
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'initial',
    width: 'fit-content',
    '& .MuiGrid-root': {
      display: 'flex',
      alignItems: 'center',
      color: 'white'
    }
  }
}));

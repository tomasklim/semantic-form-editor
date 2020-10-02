import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
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
      alignItems: 'center'
    }
  }
}));

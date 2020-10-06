import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  container: {
    margin: theme.spacing(3, 0, 4)
  },
  switchContainer: {
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: '1.1rem',
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
  },
  switchDisabled: {
    cursor: 'not-allowed'
  },
  transformForm: {
    fontStyle: 'italic',
    marginTop: '0.3rem',
    fontSize: '0.8rem'
  },
  transformFormClick: {
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.custom.main
    }
  }
}));

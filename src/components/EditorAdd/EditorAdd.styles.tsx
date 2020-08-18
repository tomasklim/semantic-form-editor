import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '../../interfaces';

export default makeStyles((theme: ITheme) => ({
  addLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '25px',
    margin: '2px 3px',
    '& svg': {
      transform: 'scale(0)',
      transitionDelay: '0',
      transitionDuration: '0.2s',
      transitionProperty: 'transform',
      color: theme.palette.custom.main
    }
  },
  '@global .addLineHover': {
    border: '2px dashed ' + theme.palette.custom.main
  },
  '@global .addLineHover svg': {
    transitionDelay: '0.3s',
    transitionDuration: '0.5s',
    transform: 'scale(0.7) !important'
  }
}));

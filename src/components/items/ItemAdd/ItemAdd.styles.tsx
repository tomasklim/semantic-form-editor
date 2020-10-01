import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  addItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '25px',
    margin: '2px 3px',
    cursor: 'pointer',
    '& svg': {
      transform: 'scale(0)',
      transitionDelay: '0',
      transitionDuration: '0.2s',
      transitionProperty: 'transform',
      color: theme.palette.custom.main
    }
  },
  '@global .addItemHover': {
    border: '2px dashed ' + theme.palette.custom.main
  },
  '@global .addItemHover svg': {
    transitionDelay: '0.3s',
    transitionDuration: '0.5s',
    transform: 'scale(0.7) !important'
  },
  highlightAddLine: {
    border: '2px solid ' + theme.palette.custom.main,
    '& svg': {
      transitionDelay: '0.3s',
      transitionDuration: '0.5s',
      transform: 'scale(0.7) !important'
    }
  },
  marginTop: {
    marginTop: '-5px'
  }
}));

import { createMuiTheme } from '@material-ui/core/styles';
import { IThemeOptions } from '../interfaces';

const theme = createMuiTheme({
  palette: {
    custom: {
      50: '#5E6882',
      100: '#565F76',
      200: '#4D566A',
      300: '#434C60',
      400: '#292F3C',
      500: '#3a4050',
      600: '#363c4a',
      700: '#313847',
      800: '#292f3c',
      900: '#19202e',
      main: '#5a81ea',
      light: '#a2b6ee',
      contrastText: '#ffffff'
    }
  },
  spacing: 8
} as IThemeOptions);

export default theme;

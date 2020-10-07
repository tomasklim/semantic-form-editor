import { createMuiTheme } from '@material-ui/core/styles';
import { IThemeOptions } from '@interfaces/index';

const theme = createMuiTheme({
  palette: {
    custom: {
      //50: '#5E6882',
      100: '#5E6882',
      200: '#565F76',
      300: '#4D566A',
      400: '#434C60',
      500: '#3a4050',
      600: '#333947',
      700: '#313847',
      800: '#292f3c',
      900: '#19202e',
      main: '#5a81ea',
      light: '#a2b6ee',
      dark: '#3C6AE4',
      contrastText: '#ffffff'
    }
  },
  spacing: 8,
  overrides: {
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0
      }
    }
  },
  custom: {}
} as IThemeOptions);

export default theme;

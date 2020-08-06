import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      100: '#363c4a',
      200: '#3a4050',
      light: '#313847',
      main: '#292f3c',
      dark: '#19202e',
      contrastText: '#fff'
    }
  },
  spacing: 8
});

export default theme;

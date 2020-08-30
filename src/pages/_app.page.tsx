import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '@components/theme';
import { useEffect } from 'react';
import 's-forms/css/s-forms.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'jsoneditor/dist/jsoneditor.css';

const EditorApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <CssBaseline />
        <Component {...pageProps} />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default EditorApp;

import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  content: {
    marginRight: theme.custom.sidebarWidth
  },
  ol: {
    listStyle: 'none',
    paddingLeft: '30px'
  },
  '@global .highlightQuestion': {
    border: '2px solid #5a81ea !important'
  }
}));

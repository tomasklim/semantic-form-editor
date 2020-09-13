import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  content: {
    marginRight: theme.custom.sidebarWidth,
    '& *': { userSelect: 'none' }
  },
  ol: {
    listStyle: 'none',
    paddingLeft: '30px'
  },
  '@global .highlightQuestion': {
    border: '2px dotted ' + theme.palette.custom.main + '!important'
  },
  '@global [data-disabled="true"]': {
    pointerEvents: 'none  !important'
  },
  '@global [data-disabled="true"] *': {
    pointerEvents: 'none  !important'
  }
}));

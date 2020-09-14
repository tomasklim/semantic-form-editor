import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  content: {
    marginRight: theme.custom.sidebarWidth,
    padding: theme.spacing(1, 2),
    '& *': { userSelect: 'none' },
    listStyle: 'none',
    margin: 0,
    '& li > div': {
      backgroundColor: theme.palette.custom[800]
    },
    '& ol li > div': {
      backgroundColor: theme.palette.custom[700]
    },
    '& ol ol li > div': {
      backgroundColor: theme.palette.custom[600]
    },
    '& ol ol ol li div': {
      backgroundColor: theme.palette.custom[500]
    },
    '& ol ol ol ol li div': {
      backgroundColor: theme.palette.custom[400]
    },
    '& ol ol ol ol ol li div': {
      backgroundColor: theme.palette.custom[300]
    }
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

import { makeStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';

// @ts-ignore
export default makeStyles((theme: ITheme) => ({
  form: {
    marginRight: theme.custom.sidebarWidth,
    padding: theme.spacing(0, 2, 1),
    listStyle: 'none',
    margin: 0,
    '& *': { userSelect: 'none' },
    '& li > div': {
      backgroundColor: theme.palette.custom[800]
    },
    '& ol li > div': {
      backgroundColor: theme.palette.custom[700]
    },
    '& ol ol li > div': {
      backgroundColor: theme.palette.custom[500]
    },
    '& ol ol ol li div': {
      backgroundColor: theme.palette.custom[400]
    },
    '& ol ol ol ol li div': {
      backgroundColor: theme.palette.custom[300]
    },
    '& ol ol ol ol ol li div': {
      backgroundColor: theme.palette.custom[200]
    },
    '& ol ol ol ol ol ol li div': {
      backgroundColor: theme.palette.custom[100]
    },
    '& ol': {
      listStyle: 'none',
      width: '100%',
      paddingLeft: 0
    }
  },
  olPaddingLeft: {
    paddingLeft: '20px !important'
  },
  '@global .highlightQuestion': {
    border: '2px dotted ' + theme.palette.custom.main + '!important'
  },
  '@global [data-disabled="true"]': {
    pointerEvents: 'none  !important'
  },
  '@global [data-disabled="true"] *': {
    pointerEvents: 'none  !important'
  },
  '@global .itemHover': {
    border: '2px dashed ' + theme.palette.custom.main + ' !important'
  }
}));

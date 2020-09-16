import { makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  page: {
    marginTop: '22px',
    border: '2px solid transparent',
    borderRadius: '2px',
    '& .MuiPaper-elevation1': {
      boxShadow: 'none'
    },
    '&:hover': {
      border: '2px dashed ' + theme.palette.custom.main
    }
  },
  accordion: {
    backgroundColor: theme.palette.custom[800],
    color: theme.palette.custom.contrastText
  },
  pageHighlight: {
    border: '2px solid ' + theme.palette.custom.main + '!important'
  }
}));

// @ts-ignore
export const CustomisedAccordionDetails = withStyles((theme: ITheme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    color: theme.palette.custom.main,
    backgroundColor: theme.palette.custom[800],
    cursor: 'pointer',
    borderRadius: '4px'
  }
}))(AccordionDetails);

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  page: {
    border: '2px solid transparent',
    margin: theme.spacing(1, 2)
  },
  pageOver: {
    border: '2px dashed ' + theme.palette.custom.main
  },
  accordion: {
    backgroundColor: theme.palette.custom[800],
    color: theme.palette.custom.contrastText
  }
}));

// @ts-ignore
export const CustomisedAccordionDetails = withStyles((theme: ITheme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    color: theme.palette.custom.main,
    backgroundColor: theme.palette.custom[900] + '99',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.palette.custom[900] + '50',
      color: theme.palette.custom.light
    }
  }
}))(AccordionDetails);

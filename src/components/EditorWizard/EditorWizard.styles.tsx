import { makeStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  page: {
    border: '2px solid transparent',
    margin: theme.spacing(1, 2)
  },
  pageOver: {
    border: '2px dashed #5a81ea'
  },
  accordion: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
}));

export const CustomisedAccordionDetails = withStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    color: '#5a81ea',
    backgroundColor: theme.palette.primary.main + '99',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.palette.primary.dark + '50',
      color: '#A2B6EE'
    }
  }
}))(AccordionDetails);

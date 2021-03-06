import { makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  itemFormEmptyContainer: {
    marginTop: '24px',
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
  itemSectionHighlight: {
    border: '2px solid ' + theme.palette.custom.main + '!important'
  },
  buttonHighlight: {
    '&.MuiButton-outlined': {
      backgroundColor: theme.palette.custom.main,
      color: 'white'
    }
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

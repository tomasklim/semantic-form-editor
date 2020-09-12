import { makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  listItemSection: {
    width: '100%',
    border: '2px solid transparent',
    '& .MuiAccordion-root': {
      color: theme.palette.custom.contrastText
    }
  },
  listItemSectionOver: {
    border: '2px dashed ' + theme.palette.custom.main
  },
  listItemSectionHighlight: {
    border: '2px solid ' + theme.palette.custom.main
  },
  ol: {
    listStyle: 'none',
    paddingLeft: '0'
  },
  emptySection: {
    fontStyle: 'italic',
    opacity: 0.6,
    margin: theme.spacing(0),
    padding: theme.spacing(1, 0, 0.5)
  },
  cardContent: {
    padding: theme.spacing(1, 2)
  }
}));

// @ts-ignore
export const CustomisedAccordionDetails = withStyles((theme: ITheme) => ({
  root: {
    borderTop: '1px solid ' + theme.palette.custom.contrastText + '0f',
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  }
}))(AccordionDetails);

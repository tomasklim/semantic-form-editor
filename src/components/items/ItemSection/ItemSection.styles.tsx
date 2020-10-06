import { makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

export default makeStyles((theme: ITheme) => ({
  '@global .listItemSection': {
    width: '100%',
    border: '2px solid transparent'
  },
  '@global .listItemSection .MuiAccordion-root': {
    color: theme.palette.custom.contrastText
  },
  '@global .listItemSectionOver': {
    border: '2px dashed ' + theme.palette.custom.main
  },
  listItemSectionHighlight: {
    border: '2px solid ' + theme.palette.custom.main + '!important'
  },
  emptySection: {
    fontStyle: 'italic',
    opacity: 0.6,
    margin: theme.spacing(0),
    padding: theme.spacing(1, 0, 0.5)
  },
  cardContent: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer'
  }
}));

// @ts-ignore
export const CustomisedAccordionDetails = withStyles((theme: ITheme) => ({
  root: {
    borderTop: '1px solid ' + theme.palette.custom.contrastText + '0f',
    padding: theme.spacing(1, 2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  }
}))(AccordionDetails);

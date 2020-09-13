import { withStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';
import { CardContent } from '@material-ui/core';

// @ts-ignore
export const CustomisedCardContent = withStyles((theme: ITheme) => ({
  root: {
    borderTop: '1px solid ' + theme.palette.custom.contrastText + '0f',
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  }
}))(CardContent);

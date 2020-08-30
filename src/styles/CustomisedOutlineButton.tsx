import {withStyles} from "@material-ui/core/styles";
import {ITheme} from "../interfaces";
import {Button} from "@material-ui/core";

// @ts-ignore
export const CustomisedOutlineButton = withStyles((theme: ITheme) => ({
  root: {
    color: theme.palette.custom.main,
    borderColor: theme.palette.custom.main,
    minWidth: '250px',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: theme.palette.custom.main,
      color: 'white'
    },
    '&:focus': {
      outline: 'none'
    }
  }
}))(Button);

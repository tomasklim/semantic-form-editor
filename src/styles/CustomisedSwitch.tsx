import { createStyles, Switch, withStyles } from '@material-ui/core';
import { ITheme } from '@interfaces/index';

// @ts-ignore
const CustomisedSwitch = withStyles((theme: ITheme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex'
    },
    switchBase: {
      padding: 2,
      color: 'white',
      backgroundColor: theme.palette.custom.main,
      '&$checked': {
        transform: 'translateX(12px)',
        color: 'white',
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.custom.main,
          borderColor: theme.palette.custom.main
        }
      }
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none'
    },
    track: {
      border: `1px solid ${theme.palette.custom.main}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.custom.main
    },
    checked: {}
  })
)(Switch);

export default CustomisedSwitch;

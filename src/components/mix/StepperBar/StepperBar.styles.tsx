import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ITheme } from '@interfaces/index';
import { StepConnector, StepIcon, StepLabel, Stepper } from '@material-ui/core';

export default makeStyles((theme: ITheme) => ({
  stepperBar: {
    backgroundColor: theme.palette.custom[600],
    marginBottom: theme.spacing(2),
    '& button:focus': {
      outline: 'none'
    }
  },
  unlockedStep: {
    '& span': {
      cursor: 'pointer',
      fontWeight: 500
    }
  }
}));

// @ts-ignore
export const CustomisedStepper = withStyles((theme: ITheme) => ({
  root: {
    backgroundColor: 'transparent',
    maxWidth: '900px',
    margin: '0 auto'
  }
}))(Stepper);

// @ts-ignore
export const CustomisedStepIcon = withStyles((theme: ITheme) => ({
  active: {
    color: theme.palette.custom.main + ' !important',
    fontWeight: 600
  },
  completed: {
    color: theme.palette.custom.main + ' !important'
  },
  root: {
    color: theme.palette.custom[300]
  }
}))(StepIcon);

// @ts-ignore
export const CustomisedStepLabel = withStyles((theme: ITheme) => ({
  active: {
    color: '#ffffff !important'
  },
  completed: {
    color: theme.palette.custom.main + ' !important'
  },
  label: {
    color: '#ffffffc7'
  }
}))(StepLabel);

// @ts-ignore
export const CustomisedConnector = withStyles((theme: ITheme) => ({
  active: {
    '& $line': {
      borderColor: theme.palette.custom.main
    }
  },
  completed: {
    '& $line': {
      borderColor: theme.palette.custom.main
    }
  },
  disabled: {
    '& $line': {
      borderColor: theme.palette.custom[300]
    }
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 1,
    borderRadius: 1
  }
}))(StepConnector);

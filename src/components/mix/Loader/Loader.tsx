import { CircularProgress } from '@material-ui/core';
import React from 'react';
import useStyles from './Loader.styles';

const Loader = () => {
  const classes = useStyles();

  return <CircularProgress className={classes.loader} size={70} />;
};

export default Loader;

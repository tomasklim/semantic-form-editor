import React, { FC } from 'react';
import useStyles from './ItemContent.styles';
import { CustomisedCardContent } from '@styles/CustomisedCardContent';

type Props = {};

const ItemContent: FC<Props> = ({}) => {
  const classes = useStyles();

  return <CustomisedCardContent className={classes.itemContent}>Content</CustomisedCardContent>;
};

export default ItemContent;

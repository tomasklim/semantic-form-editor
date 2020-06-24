import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { FC } from 'react';
import useStyles from './Footer.styles';

type Props = {};

const Footer: FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="body2" color="textSecondary">
        <Link color="inherit" href="https://www.linkedin.com/in/tomáš-klíma-8a367b131/" target="_blank">
          Copyright © {new Date().getFullYear()} by Tomáš Klíma
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;

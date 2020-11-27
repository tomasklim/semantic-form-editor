import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { FC } from 'react';
import useStyles from './Footer.styles';

type Props = {};

const Footer: FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="body2">
        <Link color="inherit" href="https://www.linkedin.com/in/tomáš-klíma-8a367b131/" target="_blank">
          The Semantic Form Editor © {new Date().getFullYear()} by Bc. Tomáš Klíma
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;

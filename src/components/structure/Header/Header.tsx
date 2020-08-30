import React from 'react';
import Link from 'next/link';
import useStyles from './Header.styles';
import HomeIcon from '@material-ui/icons/Home';

type Props = {};

const Header: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <nav>
        <Link href="/">
          <a>
            <HomeIcon /> Home
          </a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;

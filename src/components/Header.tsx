import React from 'react';
import Link from 'next/link';

type Props = {};

const Header: React.FC<Props> = ({}) => (
  <header>
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
    </nav>
    <hr />
  </header>
);

export default Header;

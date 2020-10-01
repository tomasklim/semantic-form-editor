import React from 'react';
import Head from 'next/head';
import Header from '@components/structure/Header/Header';
import Footer from '@components/structure/Footer/Footer';
import useStyles from './Layout.styles';

type Props = {
  children: React.ReactNode;
  title: string;
};

const Layout: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

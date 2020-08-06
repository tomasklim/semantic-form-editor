import React from 'react';
import Head from 'next/head';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import useStyles from './Layout.styles';

type Props = {
  children: JSX.Element;
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

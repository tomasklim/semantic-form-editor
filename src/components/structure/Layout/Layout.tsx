import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '@components/structure/Header/Header';
import Footer from '@components/structure/Footer/Footer';
import useStyles from './Layout.styles';
import { TrackJS } from 'trackjs';

type Props = {
  children: React.ReactNode;
  title: string;
};

const Layout: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      TrackJS.install({
        token: 'a5fe573aa8754a3d9d2fd99f6fcc87d1',
        application: 'master-thesis'
      });
    }
  }, []);

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

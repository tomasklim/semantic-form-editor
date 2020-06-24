import React from 'react';
import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer/Footer';
import useStyles from './Layout.styles';
import { Container } from '@material-ui/core';

type Props = {
  children: JSX.Element;
  title: string;
};

const Layout: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="xl" className={classes.root}>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      {children}
      <Footer />
    </Container>
  );
};

export default Layout;

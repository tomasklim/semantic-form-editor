import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children: JSX.Element;
  title: string;
};

const Layout: React.FC<Props> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    {children}
    <Footer />
  </div>
);

export default Layout;

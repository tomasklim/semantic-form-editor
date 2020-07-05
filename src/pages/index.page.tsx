import React from 'react';
import Layout from '@components/Layout/Layout';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@components/Editor/Editor'), {
  ssr: false
});

const IndexPage: React.FC = () => (
  <>
    <Layout title="Home">
      <Editor />
    </Layout>
  </>
);

export default IndexPage;

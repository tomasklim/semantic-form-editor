import React from 'react';
import Layout from '@components/Layout/Layout';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@components/Editor/Editor'), {
  ssr: false
});

const IndexPage: React.FC = () => (
  <>
    <Layout title="Home">
      <h1>Semantic Form Web Editor 👋</h1>
      <Editor />
    </Layout>
  </>
);

export default IndexPage;

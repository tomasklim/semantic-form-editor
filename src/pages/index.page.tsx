import React from 'react';
import Layout from '@components/Layout/Layout';
import Editor from '@components/Editor/Editor';

const IndexPage: React.FC = () => (
  <>
    <Layout title="Home">
      <h1>Semantic Form Web Editor 👋</h1>
      <Editor />
    </Layout>
  </>
);

export default IndexPage;

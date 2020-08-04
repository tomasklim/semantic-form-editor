import React from 'react';
import Layout from '@components/Layout/Layout';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@components/Editor/Editor'), {
  ssr: false
});

const FormStructureProvider = dynamic(
  // @ts-ignore
  () => import('../contexts/FormStructureContext').then((c) => c.FormStructureProvider),
  {
    ssr: false
  }
);

const IndexPage: React.FC = () => (
  <Layout title="Home">
    <FormStructureProvider>
      <Editor />
    </FormStructureProvider>
  </Layout>
);

export default IndexPage;

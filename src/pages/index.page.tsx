import React from 'react';
import Layout from '@components/structure/Layout/Layout';
import dynamic from 'next/dynamic';
import Loader from '@components/mix/Loader/Loader';

const Editor = dynamic(() => import('@components/editors/Editor/Editor'), {
  ssr: false,
  loading: () => <Loader />
});

const FormStructureProvider = dynamic(
  // @ts-ignore
  () => import('@contexts/FormStructureContext').then((c) => c.FormStructureProvider),
  {
    ssr: false,
    loading: () => <Loader />
  }
);

const EditorProvider = dynamic(
  // @ts-ignore
  () => import('@contexts/EditorContext').then((c) => c.EditorProvider),
  {
    ssr: false,
    loading: () => <Loader />
  }
);

const IndexPage: React.FC = () => (
  <Layout title="Home">
    <FormStructureProvider>
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </FormStructureProvider>
  </Layout>
);

export default IndexPage;

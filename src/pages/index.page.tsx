import React from 'react';
import Layout from '@components/structure/Layout/Layout';
import dynamic from 'next/dynamic';
import Loader from '@components/mix/Loader/Loader';
import { NavigationProvider } from '@contexts/NavigationContext';

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
  <Layout title="Semantic Form Editor">
    <FormStructureProvider>
      <EditorProvider>
        <NavigationProvider>
          <Editor />
        </NavigationProvider>
      </EditorProvider>
    </FormStructureProvider>
  </Layout>
);

export default IndexPage;

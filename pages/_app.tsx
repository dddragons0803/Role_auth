// pages/_app.tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;

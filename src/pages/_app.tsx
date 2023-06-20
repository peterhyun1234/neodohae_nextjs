import '@/assets/styles/globals.css';
import type { AppProps } from 'next/app';
import Image from 'next/image'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from 'styled-components';
import theme from '@/assets/styles/theme';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
          <title>모두가 행복한 쉐어하우스를 위한, 너도해 | 룸메이트 관계 개선 서비스</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

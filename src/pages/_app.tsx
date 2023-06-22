import '@/assets/styles/globals.css';
import type { AppProps } from 'next/app';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from 'styled-components';
import theme from '@/assets/styles/theme';
import Head from 'next/head';
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const InnerApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    console.log('session', session);
    console.log('status', status);
    console.log('isUser', isUser);

    const publicRoutes = ['/privacyPolicy', '/terms', '/auth/signin'];

    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (status === 'loading' || isPublicRoute) return;
    if (!isUser) router.push('/auth/signin');
  }, [isUser, router, status]);

  return (
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
  );
}

export default function App(props: AppProps) {
  return (
    <SessionProvider session={props.pageProps.session}>
      <InnerApp {...props} />
    </SessionProvider>
  );
}

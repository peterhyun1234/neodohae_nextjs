import '@/assets/styles/globals.css';
import type { AppProps } from 'next/app';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from 'styled-components';
import theme from '@/assets/styles/theme';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_SERVER_URI;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const queryClient = new QueryClient();

const InnerApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    const publicRoutes = ['/privacyPolicy', '/terms', '/auth/signin'];

    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (status === 'loading' || isPublicRoute) return;

    if (!isUser) {
      router.push('/auth/signin');
      return;
    }

    const isRoomRoute = router.pathname === '/room';
    if (isRoomRoute) return;

    const user: any = session?.user;
    if (user && (user.roomId === null || user.roomId === undefined)) {
      router.push('/room');
      return;
    }
  }, [isUser, router, status, session]);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
        <title>
          모두가 행복한 쉐어하우스를 위한, 너도해 | 룸메이트 관계 개선 서비스
        </title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default function App(props: AppProps) {
  return (
    <SessionProvider session={props.pageProps.session}>
      <InnerApp {...props} />
    </SessionProvider>
  );
}

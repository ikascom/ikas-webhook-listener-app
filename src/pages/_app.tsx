import 'reflect-metadata';
import React, { useEffect } from 'react';
import { configure } from 'mobx';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { IkasThemeConfigProvider, lightTheme, PageLayout, locales, Toaster } from '@ikas/components';
import { setComponentTranslations } from '@ikas-apps/common-client';
import { config } from '@ikas-shipping-app/common';

import { BroadcastListener } from '@/lib/broadcast';

import '@ikas/components/build/src/styles/global.css';
import '../style.css';

configure({ enforceActions: 'never' });

const redirect = (storeName: string) => {
  window.location.replace(`${config.adminUrl!.replace('{storeName}', storeName)}/authorized-app/${config.oauth.clientId}`);
};

const checkIFrame = (storeName?: string) => {
  try {
    if (!window.location.href.endsWith('/saved-card/connect')) {
      if (window.self === window.top) {
        if (storeName) redirect(storeName);
      }
    }
  } catch (e) {
    console.error(e);
    if (storeName) redirect(storeName);
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    setComponentTranslations('tr');
    BroadcastListener.instance.start();
    checkIFrame(pageProps.user?.storeName);
  }, []);

  const Layout = ({ children }: any) => {
    if (router.asPath === '/') {
      return <>{children}</>;
    }

    return (
      <PageLayout>
        <PageLayout.Content>{children}</PageLayout.Content>
      </PageLayout>
    );
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <IkasThemeConfigProvider locale={locales.trTR}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </IkasThemeConfigProvider>
    </ThemeProvider>
  );
}

export default MyApp;

'use client';

import { useEffect, useState } from 'react';
import { AppBridgeHelper } from '@ikas/app-helpers';
import { useRouter } from 'next/navigation';

import { TokenHelpers } from '../../helpers/token-helpers';
import { CheckForReauthorizeApiResponse } from '../api/oauth/check-for-reauthorize/route';
import { ApiRequests } from '../../lib/api-requests';

export function useBaseHomePage() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        AppBridgeHelper.closeLoader();
        const params = new URLSearchParams(window.location.search);
        // Retrieve token from session storage or from ikas via AppBridge
        let token = await TokenHelpers.getTokenForIframeApp(router);

        let isInternallyLoaded = false;
        if (token) {
          // If we received token this means app is loaded within ikas Dashboard
          isInternallyLoaded = true;
        } else {
          // App is not loaded in within ikas Dashboard try to load token via query params
          token = await TokenHelpers.getTokenForExternalApp(router, params);
        }
        if (token) {
          // If you successfully received token it is suggested checking if your app requires re-authorization
          const res = await ApiRequests.oauth.checkForReauthorize(token);
          const data: CheckForReauthorizeApiResponse | undefined = res.data?.data;
          if (data?.required) {
            if (isInternallyLoaded) {
              // Call app bridge reaAuthorizeApp function so ikas dashboard will navigate to app grant access page
              AppBridgeHelper.reAuthorizeApp(data.authorizeData!);
            } else {
              // Redirect to authorize api
              window.location.replace(`/api/oauth/authorize/ikas?storeName=${params.get('storeName')}`);
              throw 'authorize-needed';
            }
          } else {
            await router.push('/dashboard');
          }
        } else {
          await router.push('/authorize-store');
        }
      } finally {
        setLoading(false);
      }
    }
    if (isLoading) return;
    setLoading(true);

    load();

    return () => {};
  }, []);
}

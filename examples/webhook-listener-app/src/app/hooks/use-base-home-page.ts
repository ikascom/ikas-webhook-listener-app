'use client';

import { useEffect, useState } from 'react';
import { AppBridgeHelper } from '@ikas/app-helpers';
import { useRouter } from 'next/navigation';

import { TokenHelpers } from '../../helpers/token-helpers';
import { CheckForReauthorizeApiResponse } from '../api/oauth/check-for-reauthorize/route';
import { ApiRequests } from '../../lib/api-requests';

/**
 * useBaseHomePage
 * - Handles the initial authentication and authorization flow for the app.
 * - Checks for token presence and validity, and redirects as needed.
 * - Handles both internal (iFrame) and external (direct) app loading scenarios.
 */
export function useBaseHomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {


    /**
     * Handles the authentication and authorization logic.
     */
    const initialize = async () => {
      try {
        // Close any existing loader in the iKas AppBridge
        AppBridgeHelper.closeLoader();

        // Parse query parameters from the URL
        const params = new URLSearchParams(window.location.search);

        // Try to get token from iFrame (internal) context
        let token = await TokenHelpers.getTokenForIframeApp(router);

        // Flag to determine if app is loaded inside iKas Dashboard
        let isInternal = Boolean(token);

        // If not internal, try to get token from external context (query params)
        if (!token) {
          token = await TokenHelpers.getTokenForExternalApp(router, params);
        }

        if (token) {
          // Check if re-authorization is required
          const response = await ApiRequests.oauth.checkForReauthorize(token);
          const data: CheckForReauthorizeApiResponse | undefined = response.data?.data;

          if (data?.required) {
            if (isInternal) {
              // If loaded inside iKas Dashboard, trigger re-authorization via AppBridge
              AppBridgeHelper.reAuthorizeApp(data.authorizeData!);
            } else {
              // If external, redirect to authorization endpoint
              window.location.replace(`/api/oauth/authorize/ikas?storeName=${params.get('storeName')}`);
              throw new Error('Authorization required');
            }
          } else {
            // Token is valid and no re-authorization needed, go to dashboard
            await router.push('/dashboard');
          }
        } else {
          // No token found, redirect to store authorization page
          await router.push('/authorize-store');
        }
      } catch (error) {
        // Optionally log error for debugging
        // console.error('Error during base home page initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    // Prevent running the effect if already loading
    if (isLoading) return;
    setIsLoading(true);
    initialize();

    // No cleanup needed
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { TokenHelpers } from '../../helpers/token-helpers';
import { ApiRequests } from '../../lib/api-requests';
import ProductPage from '../../components/product-page';

/**
 * DashboardPage
 * - Main dashboard component that displays product management interface
 */
export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');

  /**
   * Fetches and sets the store name using the provided token.
   */
  const fetchStoreName = useCallback(async (currentToken: string) => {
    try {
      const res = await ApiRequests.ikas.getMerchant(currentToken);
      if (res.status === 200 && res.data?.data?.merchantInfo?.storeName) {
        setStoreName(res.data.data.merchantInfo.storeName);
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
    }
  }, []);

  /**
   * Initializes the dashboard by fetching the token and store name.
   */
  const initializeDashboard = useCallback(async () => {
    try {
      const fetchedToken = await TokenHelpers.getTokenForIframeApp(router);
      setToken(fetchedToken || null);

      if (fetchedToken) {
        await fetchStoreName(fetchedToken);
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    }
  }, [router, fetchStoreName]);

  // Run initialization on mount
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Simply render the ProductPage component
  return <ProductPage token={token} storeName={storeName} />;
}

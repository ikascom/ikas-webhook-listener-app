'use client';

import { AppBridgeHelper } from '@ikas/app-helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TokenHelpers } from '@/helpers/token-helpers';

interface TokenData {
  storeName: string;
  merchantId: string;
  authorizedAppId: string;
  accessToken: string;
}

export default function ProcessWebhooks() {
  const router = useRouter();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = (await TokenHelpers.getTokenForIframeApp(router)) || null;
      if (!token) return await router.push('/');
      
      // Close the app bridge loader
      AppBridgeHelper.closeLoader();
      
      setLoading(false);
      return;
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: 'red'
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>No token data available</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#333',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        Webhook Processor
      </h1>
      
      <div style={{
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#495057',
          marginTop: '0',
          marginBottom: '15px'
        }}>
          Store Information
        </h2>
        
        <div style={{ 
          background: 'white',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Store Name:</strong> {tokenData.storeName}
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Merchant ID:</strong> {tokenData.merchantId}
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>App ID:</strong> {tokenData.authorizedAppId}
          </p>
          <p style={{ margin: '0' }}>
            <strong>Token Status:</strong> 
            <span style={{ 
              color: '#28a745',
              marginLeft: '8px',
              fontWeight: 'bold'
            }}>
              ✓ Active
            </span>
          </p>
        </div>
      </div>

      <div style={{
        background: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '8px',
        padding: '15px'
      }}>
        <h3 style={{ 
          color: '#0056b3',
          marginTop: '0',
          marginBottom: '10px'
        }}>
          Webhook Processing Ready
        </h3>
        <p style={{ 
          margin: '0',
          color: '#0056b3'
        }}>
          This action page can process webhooks for store: <strong>{tokenData.storeName}</strong>
        </p>
      </div>
    </div>
  );
} 
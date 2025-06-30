import React, { useState } from 'react';
import { ApiRequests } from '@/lib/api-requests';

export default function TestApiPage() {
  const [token, setToken] = useState('');
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGetMerchant = async () => {
    if (!token) {
      setError('Token gerekli');
      return;
    }

    setLoading(true);
    setError(null);
    setMerchantInfo(null);

    try {
      const response = await ApiRequests.ikas.getMerchant(token);
      
      if (response.status === 200 && response.data?.data?.merchantInfo) {
        setMerchantInfo(response.data.data.merchantInfo);
      } else {
        setError('Merchant bilgileri alınamadı');
      }
    } catch (err: any) {
      setError(err.message || 'API hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>İkas API Test Sayfası</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>getMerchant API Test</h3>
        <p>Bu sayfa, İkas API'sinin getMerchant endpoint'ini test etmek için kullanılır.</p>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Token:
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="JWT token'ınızı girin"
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </label>
        </div>
        
        <button
          onClick={testGetMerchant}
          disabled={loading || !token}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Yükleniyor...' : 'Merchant Bilgilerini Al'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Hata:</strong> {error}
        </div>
      )}

      {merchantInfo && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <h3>Merchant Bilgileri</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(merchantInfo, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Kullanım Örneği</h3>
        <p>Bu API'yi kullanmak için:</p>
        <ol>
          <li>OAuth callback'ten JWT token alın</li>
          <li>Token'ı yukarıdaki alana girin</li>
          <li>"Merchant Bilgilerini Al" butonuna tıklayın</li>
          <li>API response'unu kontrol edin</li>
        </ol>
        
        <h4>Kod Örneği:</h4>
        <pre style={{ 
          backgroundColor: '#e9ecef', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`import { ApiRequests } from '@/lib/api-requests';

const response = await ApiRequests.ikas.getMerchant(token);
const merchantInfo = response.data.data.merchantInfo;
console.log('Mağaza adı:', merchantInfo.storeName);`}
        </pre>
      </div>
    </div>
  );
} 
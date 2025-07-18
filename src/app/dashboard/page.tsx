'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// TokenHelpers'ı doğru path'ten import et
import { TokenHelpers } from '@/helpers/token-helpers';
import { ApiRequests } from '../../lib/api-requests';

export default function DashboardPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      // 1. get token
      const token = await TokenHelpers.getTokenForIframeApp(router);
      if (!token) {
        setLoading(false);
        return;
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!merchant) return <div>Merchant bulunamadı.</div>;

  return (
    <div>
      <h2>Merchant Bilgisi</h2>
      <pre>{JSON.stringify(merchant, null, 2)}</pre>
      {/* Burada başka bir sayfaya yönlendirme de ekleyebilirsin */}
      {/* örn: router.push('/baska-sayfa') */}
    </div>
  );
}
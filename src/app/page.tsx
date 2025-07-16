'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function useBaseHomePage() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      // Burada AppBridge, token, dil, reauthorize vs. eklenebilir
      // Şimdilik sadece authorize-store'a yönlendiriyoruz
      await router.push('/authorize-store');
      setLoading(false);
    }
    if (isLoading) return;
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen text-gray-500 text-2xl font-medium">
      <div>Lütfen Bekleyin...</div>
    </div>
  );
}

export default function HomePage() {
  useBaseHomePage();
  return <Loading />;
}

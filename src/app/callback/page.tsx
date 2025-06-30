'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TokenHelpers, Loading } from '@ikas-apps/common-client';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams(searchParams.toString());
      await TokenHelpers.setToken(router, params);
    };
    load();
  }, [router, searchParams]);

  return <Loading />;
} 
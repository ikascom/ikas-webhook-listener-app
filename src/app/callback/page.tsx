'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from "@/components/Loading";
import { TokenHelpers } from '../../helpers/token-helpers';

 function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams(searchParams.toString());
      console.log(params);
      await TokenHelpers.setToken(router, params);
    };
    load();
  }, [router, searchParams]);

  return <Loading />;
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}

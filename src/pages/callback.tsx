import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TokenHelpers, Loading } from '@ikas-apps/common-client';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams(window.location.search);
      await TokenHelpers.setToken(router, params);
    };
    load();
  }, []);

  return <Loading />;
};

export default Home;

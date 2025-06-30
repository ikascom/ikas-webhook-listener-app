import React from 'react';
import { useBaseHomePage } from '@ikas-apps/common-client';

import { Loading } from '@ikas-apps/common-client';

function Home() {
  useBaseHomePage();

  return <Loading />;
}

export default Home;

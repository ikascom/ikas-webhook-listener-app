'use client';

import React from 'react';
import { useBaseHomePage } from './hooks/use-base-home-page';
import Loading from '../components/loading';

export default function Home() {
  useBaseHomePage();
  return <Loading />;
}
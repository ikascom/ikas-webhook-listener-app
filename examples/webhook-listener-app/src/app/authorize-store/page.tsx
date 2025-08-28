'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * AuthorizeStorePage
 * - Renders a form for the user to enter their store name and authorize the app.
 * - Handles error display if redirected back with a failure status.
 */
const AuthorizeStorePage: React.FC = () => {
  // State for the store name input
  const [storeName, setStoreName] = useState('');
  // State to control error message visibility
  const [showError, setShowError] = useState(false);

  // Parse query params on mount to prefill storeName and show error if needed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'fail') {
      setShowError(true);
    }
    const store = params.get('storeName');
    if (store) {
      setStoreName(store);
    }
  }, []);

  // Handler for input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStoreName(e.target.value);
      if (showError) setShowError(false); // Hide error on user input
    },
    [showError]
  );

  return (
    <main className="min-h-[100vh] flex flex-col items-center justify-center pb-20">
      <div className="flex flex-col items-center justify-center w-full max-w-[28rem] px-4">
        <Image src="/logo.png" alt="ikas Logo" className="max-w-[20rem] mb-12" />
        <form method="GET" action="/api/oauth/authorize/ikas" autoComplete="off" className="w-full">
          <Input
            name="storeName"
            placeholder="Enter your store name"
            value={storeName}
            onChange={handleInputChange}
            required
            autoFocus
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
          />
          <Button type="submit" disabled={!storeName.trim()} className="w-full mt-6">
            Add to My Store
          </Button>
          {showError && (
            <div className="text-red-600 text-center mt-3 text-base">
              An error occurred. Please try again.
            </div>
          )}
        </form>
      </div>
    </main>
  );
};

export default AuthorizeStorePage;
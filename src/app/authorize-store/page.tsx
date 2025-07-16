'use client';

import React, { useEffect, useState } from 'react';

export default function AuthorizeStorePage() {
  const [storeName, setStoreName] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('status') && params.get('status') === 'fail') {
      setShowError(true);
    }
    if (params.has('storeName')) {
      setStoreName(params.get('storeName') || '');
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center pb-20">
      <div className="flex flex-col justify-center items-center w-full max-w-md px-4">
        <img src="/logo.png" alt="ikas Logo" className="max-w-xs mb-12" />
        <form method="GET" action="/api/oauth/authorize/ikas" className="w-full">
          <input
            name="storeName"
            placeholder="Mağaza adınızı girin"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="text-black w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 mt-6 disabled:opacity-50"
            disabled={!storeName}
          >
            Mağazama Ekle
          </button>
          {showError && (
            <div className="text-red-600 text-center mt-3 text-base">
              Bir hata oluştu. Lütfen tekrar deneyin.
            </div>
          )}
        </form>
      </div>
    </main>
  );
} 
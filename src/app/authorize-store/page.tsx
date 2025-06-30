'use client';

import { AuthorizeStore } from '@ikas-apps/common-client';
import { Button, Input } from '@ikas/components';

export default function AuthorizeStorePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthorizeStore src="/logo.png" Input={Input} Button={Button} />
    </div>
  );
} 
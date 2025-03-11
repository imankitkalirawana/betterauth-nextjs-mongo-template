'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          shouldShowTimeoutProgress: true
        }}
      />
      {children}
    </HeroUIProvider>
  );
}

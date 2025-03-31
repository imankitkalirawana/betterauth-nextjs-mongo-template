'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextTopLoader from 'nextjs-toploader';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          shouldShowTimeoutProgress: true
        }}
      />
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          {children}
          <NextTopLoader
            height={4}
            showSpinner={false}
            shadow="false"
            easing="ease"
            color="hsl(var(--heroui-primary))"
          />
        </NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

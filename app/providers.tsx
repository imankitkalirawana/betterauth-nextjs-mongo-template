'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextTopLoader from 'nextjs-toploader';
import { useRouter } from 'nextjs-toploader/app';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000
      }
    }
  });
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        toastProps={{
          variant: 'flat',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          radius: 'lg'
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

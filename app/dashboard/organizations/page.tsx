import Organizations from '@/components/dashboard/organizations';
import { auth } from '@/lib/auth';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { Organization as OrganizationType } from 'better-auth/plugins';

async function getOrganizations() {
  const res = await fetch('/api/v1/organizations');
  return await res.json();
}

export default async function OrganizationsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['organizations'],
    queryFn: getOrganizations
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Organizations />
    </HydrationBoundary>
  );
}

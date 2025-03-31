import Organization from '@/components/dashboard/organizations/organization';
import { auth } from '@/lib/auth';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { headers } from 'next/headers';

async function getOrganization(slug: string) {
  const organization = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations/${slug}`,
    {
      headers: headers()
    }
  );

  return await organization.json();
}

export default async function OrganizationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const queryClient = new QueryClient();  

  await queryClient.prefetchQuery({
    queryKey: ['organization', params.slug],
    queryFn: () => getOrganization(params.slug)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Organization slug={params.slug} />
    </HydrationBoundary>
  );
}

'use client';
import { useQuery } from '@tanstack/react-query';

async function getOrganization(slug: string) {
  const organization = await fetch(`/api/v1/organizations/${slug}`);

  return organization.json();
}

export default function Organization({ slug }: { slug: string }) {
  const { data } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => getOrganization(slug)
  });

  return <div>Organization</div>;
}

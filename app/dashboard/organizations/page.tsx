import Organizations from '@/components/dashboard/organizations';
import { OrganizationType } from '@/models/Organization';
import { headers } from 'next/headers';

async function getOrganizations() {
  try {
    const res = await fetch(
      `${process.env.BETTER_AUTH_URL}api/v1/organizations`,
      {
        headers: await headers()
      }
    );
    return (await res.json()).organizations;
  } catch (error: any) {
    console.error(error);
    return [] as OrganizationType[];
  }
}

export default async function OrganizationsPage() {
  const organizations: OrganizationType[] = await getOrganizations();

  return <Organizations organizations={organizations} />;
}

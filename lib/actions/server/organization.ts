'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import slugify from 'slugify';

export async function createOrganization({
  name,
  logo,
  userId
}: {
  name: string;
  logo?: string;
  userId?: string;
}) {
  await auth.api.createOrganization({
    body: {
      name,
      slug: slugify(name, { lower: true }),
      logo,
      userId
    },
    headers: headers()
  });
}

export async function deleteOrganization({
  organizationId
}: {
  organizationId: string;
}) {
  await auth.api.deleteOrganization({
    body: { organizationId },
    headers: headers()
  });
}

export async function addMemberToOrganization({
  userId,
  organizationId,
  role
}: {
  userId: string;
  organizationId: string;
  role: 'admin' | 'member' | 'owner';
}) {
  await auth.api.addMember({
    body: {
      userId,
      organizationId,
      role
    }
  });
}

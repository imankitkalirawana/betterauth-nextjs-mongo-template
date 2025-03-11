'use server';

import { auth } from '@/lib/auth';

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

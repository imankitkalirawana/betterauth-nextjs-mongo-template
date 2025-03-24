import { NextResponse } from 'next/server';
import Organization from '@/models/Organization';
import { connectDB } from '@/lib/db';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const GET = async function GET(request: any) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const allowedUsers = ['admin', 'superadmin', 'user'];

  if (!session?.user || !allowedUsers.includes(session?.user?.role || '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const organizations = await Organization.find();

    const totalOrganizations = await Organization.countDocuments();

    return NextResponse.json({
      organizations,
      totalOrganizations
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

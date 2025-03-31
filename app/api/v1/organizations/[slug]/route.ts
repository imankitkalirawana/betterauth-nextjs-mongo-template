import { NextResponse } from 'next/server';
import Organization from '@/models/Organization';
import { connectDB } from '@/lib/db';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Organization as OrganizationType } from 'better-auth/plugins';
export const GET = async function GET(request: any, context: any) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = context.params;

    await connectDB();

    let organization: OrganizationType | null;

    if (session.user.role === 'admin') {
      organization = await Organization.findOne({ slug });
    } else {
      organization = await auth.api.getFullOrganization({
        query: {
          organizationSlug: slug
        },
        headers: headers()
      });
    }

    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};

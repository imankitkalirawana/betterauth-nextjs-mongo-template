import { NextResponse } from 'next/server';
import Organization from '@/models/Organization';
import { connectDB } from '@/lib/db';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const GET = async function GET(request: any) {
  const session = await auth.api.getSession({
    headers: headers()
  });

  const allowedUsers = ['admin', 'superadmin', 'user'];

  if (!session?.user || !allowedUsers.includes(session?.user?.role || '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const query = searchParams.get('query')?.trim() || '';
  const sort = {
    column: searchParams.get('sortColumn') || 'name',
    direction: searchParams.get('sortDirection') || 'ascending'
  };

  const searchQuery = {
    ...(query
      ? {
          $or: [
            { name: { $regex: new RegExp(query.trim(), 'ig') } },
            { slug: { $regex: new RegExp(query.trim(), 'ig') } }
          ].filter(Boolean) as any[]
        }
      : {})
  };

  await connectDB();

  const sortObject: Record<string, 1 | -1> = {
    [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
  };

  try {
    let organizations = [];
    if (session?.user?.role === 'admin') {
      organizations = await Organization.find(searchQuery)
        .sort(sortObject)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    } else {
      organizations = await auth.api.listOrganizations({
        headers: headers()
      });
    }

    const total = await Organization.countDocuments(searchQuery);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ organizations, total, totalPages });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

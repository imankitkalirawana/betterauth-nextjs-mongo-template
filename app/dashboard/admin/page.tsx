import { getSession } from '@/lib/actions/server/session';

export default async function AdminPage() {
  const session = await getSession();

  return <div>AdminPage</div>;
}

import { getSession } from '@/lib/actions/server/session';

export default async function AdminPage() {
  const session = await getSession();
  console.log(session?.user);

  return <div>AdminPage</div>;
}

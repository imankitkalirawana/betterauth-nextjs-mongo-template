'use client';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'nextjs-toploader/app';
async function signOut() {
  await authClient.signOut();
}

export default async function LogoutPage() {
  const router = useRouter();
  await signOut().then(() => {
    router.push('/auth/login');
  });

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}

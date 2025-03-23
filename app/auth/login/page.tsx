'use client';
import { Button } from '@heroui/react';
import { handleLogin } from '@/lib/actions/client/auth';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

async function addPasskey() {
  const response = await authClient.passkey.addPasskey();
  const data = response?.data;
  const error = response?.error;
  console.log(data, error);
}

async function signInWithPasskey() {
  return await authClient.signIn.passkey();
}

export default function LoginPage() {
  const router = useRouter();

  return (
    <div>
      <Button
        onPress={() =>
          handleLogin({
            email: process.env.NEXT_PUBLIC_TEMP_EMAIL || '',
            password: process.env.NEXT_PUBLIC_TEMP_PASSWORD || ''
          })
        }
      >
        Login
      </Button>
      <Button onPress={addPasskey}>Add Passkey</Button>
      <Button
        onPress={async () => {
          await signInWithPasskey()
            .then(() => {
              router.push('/dashboard');
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        Sign In With Passkey
      </Button>
    </div>
  );
}

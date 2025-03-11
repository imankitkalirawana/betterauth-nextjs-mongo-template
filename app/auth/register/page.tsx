'use client';
import Register from '@/components/auth/Register';
import { addMemberToOrganization } from '@/lib/actions/server/organization';
import { authClient } from '@/lib/auth-client';
import { Button } from '@heroui/react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const handleRegister = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        image: 'https://example.com/image.png',
        callbackURL: '/dashboard'
      },
      {
        onRequest: (ctx) => {
          console.log('onRequest', ctx);
        },
        onSuccess: async (ctx) => {
          console.log('onSuccess', ctx);
          await addMemberToOrganization({
            userId: ctx.data.user.id,
            organizationId: '67c8533d608cf456576c29c4',
            role: 'member'
          });
          toast.success('success');
        },
        onError: (ctx) => {
          // display the error message
          console.log('onError', ctx);
          toast.error(ctx.error.message);
        }
      }
    );

    console.log(data, error);
  };
  return <Register />;
}

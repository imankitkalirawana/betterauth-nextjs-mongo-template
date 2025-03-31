'use client';

import { authClient } from '@/lib/auth/client';

export const handleLogin = async ({
  email,
  password,
  callbackURL = '/dashboard',
  rememberMe = false,
  onRequest,
  onSuccess,
  onError
}: {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
  onRequest?: (ctx: any) => void;
  onSuccess?: (ctx: any) => void;
  onError?: (ctx: any) => void;
}) => {
  const { data, error } = await authClient.signIn.email(
    {
      email,
      password,
      callbackURL,
      rememberMe
    },
    {
      onRequest: (ctx) => {
        console.log('onRequest', ctx);
        onRequest?.(ctx);
      },
      onSuccess: (ctx) => {
        console.log('onSuccess', ctx);
        onSuccess?.(ctx);
      },
      onError: (ctx) => {
        console.log('onError', ctx);
        onError?.(ctx);
      }
    }
  );
  return { data, error };
};

export const handleRegister = async ({
  email,
  password,
  name
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name
  });
};

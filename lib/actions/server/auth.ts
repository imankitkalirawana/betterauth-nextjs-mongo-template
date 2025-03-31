'use server';

import User from '@/models/User';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { handleRegister } from '../client/auth';
import { auth } from '@/lib/auth';
import random from 'random-name';
import { redirect } from 'next/navigation';

const passwordGenerator = async () => {
  const password =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const hashedPassword = await bcrypt.hash(password, 12);
  return { password, hashedPassword };
};

export const sendOTP = async ({
  email,
  type = 'email-verification'
}: {
  email: string;
  type?: 'email-verification' | 'sign-in' | 'forget-password';
}) => {
  await auth.api
    .sendVerificationOTP({
      body: {
        email,
        type
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err.body?.message);
    });
};

export const verifyOTP = async ({
  email,
  otp,
  type = 'email-verification'
}: {
  email: string;
  otp: string;
  type?: 'email-verification' | 'forget-password';
}) => {
  await auth.api
    .getVerificationOTP({
      query: {
        email,
        type
      }
    })
    .then(async (res) => {
      if (res.otp === otp) {
        if (type === 'email-verification') {
          return res;
        } else if (type === 'forget-password') {
          return res;
        }
      } else {
        throw new Error('Invalid OTP');
      }
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err.body?.message);
    });
};

export const forgetPassword = async ({
  email,
  password,
  otp
}: {
  email: string;
  password: string;
  otp: string;
}) => {
  await auth.api
    .resetPasswordEmailOTP({
      body: {
        email,
        password,
        otp
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err.body.message);
    });
};

export const register = async ({
  email,
  password,
  name
}: {
  email: string;
  password: string;
  name: string;
}) => {
  await auth.api
    .createUser({
      body: {
        name: random.first() + ' ' + random.last(),
        email,
        password
      }
    })
    .then(async () => {
      await auth.api
        .signInEmail({
          body: {
            email,
            password,
            rememberMe: true
          }
        })
        .then(async (res) => {
          await auth.api.verifyEmail({
            query: {
              token: res.token
            }
          });
        })
        .catch((err) => {
          throw new Error(err.body?.message);
        });
    })
    .catch((err) => {
      throw new Error(err.body?.message);
    });
};

export const login = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  await auth.api
    .signInEmail({
      body: {
        email,
        password,
        rememberMe: true
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.body?.message);
    });
};

'use client';
import { useState } from 'react';
import { Button, Link, Input, InputOtp, addToast } from '@heroui/react';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';
import { register, sendOTP, verifyOTP } from '@/lib/actions/server/auth';
import * as Yup from 'yup';

import Logo from '@/components/ui/logo';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'nextjs-toploader/app';

export default function Register() {
  const [email, setEmail] = useQueryState('email');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const router = useRouter();

  type states = 'email-verification' | 'otp-verification' | 'register';

  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      name: '',
      otp: '',
      password: '',
      confirmPassword: '',
      state: 'email-verification' as states
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required')
    }),
    onSubmit: async (values) => {
      await stateMap[values.state].onSubmit();
    }
  });

  const resendOtp = async () => {
    setIsResendingOtp(true);
    const res = await sendOTP({
      email: formik.values.email,
      type: 'email-verification'
    });
    if (res.success) {
      addToast({
        title: 'Verification code sent to your email',
        color: 'success'
      });
      formik.setFieldValue('state', 'otp-verification');
    } else {
      formik.setFieldError('otp', res.message);
    }
    setIsResendingOtp(false);
  };

  const stateMap: Record<
    states,
    {
      title: string;
      buttonText: string;
      content: React.ReactNode;
      onSubmit: () => Promise<void>;
    }
  > = {
    'email-verification': {
      title: 'Enter your email to register',
      buttonText: 'Send OTP',
      content: <></>,
      onSubmit: async () => {
        const res = await sendOTP({
          email: formik.values.email,
          type: 'email-verification'
        });
        if (res.success) {
          formik.setFieldValue('state', 'otp-verification');
        } else {
          formik.setFieldError('email', res.message);
        }
      }
    },
    'otp-verification': {
      title: 'Enter the verification code sent to your email',
      buttonText: 'Verify',
      content: (
        <>
          <InputOtp
            length={6}
            name="otp"
            radius="lg"
            value={formik.values.otp}
            onValueChange={(value) => formik.setFieldValue('otp', value)}
            autoFocus
            onComplete={() => formik.handleSubmit()}
            isInvalid={formik.touched.otp && formik.errors.otp ? true : false}
            errorMessage={
              <span className="line-clamp-1 max-w-[200px] text-sm capitalize">
                {formik.errors.otp}
              </span>
            }
          />
          <div className="flex flex-col items-center justify-between px-1 text-small text-default-500">
            <p>Didn&apos;t receive the code?</p>
            <Button
              variant="light"
              size="sm"
              color="primary"
              onPress={resendOtp}
              isLoading={isResendingOtp}
            >
              Resend Code
            </Button>
          </div>
        </>
      ),
      onSubmit: async () => {
        const res = await verifyOTP({
          email: formik.values.email,
          otp: formik.values.otp
        });
        if (res.success) {
          formik.setFieldValue('state', 'register');
        } else {
          formik.setFieldError('otp', res.message);
        }
      }
    },
    register: {
      title: 'Enter your details to continue',
      buttonText: 'Register',
      content: (
        <>
          <Input
            label="Name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            radius="lg"
            // isInvalid={formik.touched.name && formik.errors.name ? true : false}
            // errorMessage={formik.errors.name}
            validate={(value) => {
              if (value.length < 3) {
                return 'Name must be at least 3 characters long';
              }
              if (value.length > 20) {
                return 'Name must be less than 20 characters';
              }
              return null;
            }}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            radius="lg"
            validate={(value) => {
              if (value.length < 8) {
                return 'Password must be at least 8 characters long';
              }
              if (value.length > 20) {
                return 'Password must be less than 20 characters';
              }
              if (!/[A-Z]/.test(value)) {
                return 'Password must contain at least one uppercase letter';
              }
              if (!/[0-9]/.test(value)) {
                return 'Password must contain at least one number';
              }
              if (!/[!@#$%^&*]/.test(value)) {
                return 'Password must contain at least one special character';
              }
              if (!/[a-z]/.test(value)) {
                return 'Password must contain at least one lowercase letter';
              }
              return null;
            }}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            radius="lg"
            validate={(value) => {
              if (value !== formik.values.password) {
                return 'Passwords must match';
              }
              return null;
            }}
          />
        </>
      ),
      onSubmit: async () => {
        const res = await register({
          email: formik.values.email,
          password: formik.values.password,
          name: formik.values.name
        });
        if (res.success) {
          await authClient.emailOtp.verifyEmail({
            email: formik.values.email,
            otp: formik.values.otp
          });
          router.push('/dashboard');
        } else {
          formik.setFieldError('name', res.message);
        }
      }
    }
  };

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col justify-center gap-4 rounded-3xl bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center">
            <Logo />
            <p className="text-center text-small text-default-500">
              {stateMap[formik.values.state].title}
            </p>
          </div>

          <form
            className="flex flex-col items-center gap-2"
            onSubmit={formik.handleSubmit}
          >
            <Input
              label="Email"
              name="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
                formik.setFieldValue('email', e.target.value);
              }}
              value={formik.values.email}
              radius="lg"
              isInvalid={
                formik.touched.email && formik.errors.email ? true : false
              }
              errorMessage={formik.errors.email}
              className={
                formik.values.state !== 'email-verification' ? 'sr-only' : ''
              }
              isDisabled={formik.values.state !== 'email-verification'}
            />
            {stateMap[formik.values.state].content}
            <Button
              color="primary"
              type="submit"
              isLoading={formik.isSubmitting}
              fullWidth
              radius="lg"
              variant="shadow"
              className="mt-4 py-6"
            >
              {stateMap[formik.values.state].buttonText}
            </Button>
          </form>

          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href={`/auth/login?email=${email}`} size="sm">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

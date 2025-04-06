'use client';
import { addToast, Button, Input, InputOtp, toast } from '@heroui/react';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Link from 'next/link';
import Logo from '../ui/logo';
import { forgetPassword, sendOTP, verifyOTP } from '@/lib/actions/server/auth';
import { useQueryState } from 'nuqs';
import { useRouter } from 'nextjs-toploader/app';

export default function ForgotPassword() {
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [email, setEmail] = useQueryState('email');
  const router = useRouter();

  type states = 'email-verification' | 'otp-verification' | 'set-password';

  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      otp: '',
      state: 'email-verification' as states,
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required')
    }),
    onSubmit: async (values) => {
      await stateMap[values.state].onSubmit();
    }
  });

  const resendOtp = async () => {
    setIsResendingOtp(true);
    const res = await sendOTP({
      email: formik.values.email,
      type: 'forget-password'
    });
    if (res.success) {
      addToast({
        title: 'Verification code sent to your email',
        color: 'success'
      });
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
      title: 'Enter your email to reset your password',
      buttonText: 'Send Otp',
      content: <></>,
      onSubmit: async () => {
        const res = await sendOTP({
          email: formik.values.email,
          type: 'forget-password'
        });
        if (res.success) {
          formik.setFieldValue('state', 'otp-verification');
        } else {
          formik.setFieldError('email', res.message);
        }
      }
    },
    'otp-verification': {
      title: 'Enter the OTP sent to your email',
      buttonText: 'Verify Otp',
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
          otp: formik.values.otp,
          type: 'forget-password'
        });
        if (res.success) {
          formik.setFieldValue('state', 'set-password');
        } else {
          formik.setFieldError('otp', res.message);
        }
      }
    },
    'set-password': {
      title: 'Set your new password',
      buttonText: 'Update Password',
      content: (
        <>
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
        const res = await forgetPassword({
          email: formik.values.email,
          password: formik.values.password,
          otp: formik.values.otp
        });
        if (res.success) {
          addToast({
            title: 'Password updated successfully',
            description: 'You can now login with your new password',
            color: 'success'
          });
          router.push(`/auth/login?email=${formik.values.email}`);
        } else {
          formik.setFieldError('password', res.message);
        }
      }
    }
  };
  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-content1 px-8 py-6 shadow-small">
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
        </div>
      </div>
    </>
  );
}

const UpdatePassword = ({ otp }: { otp: string }) => {
  const [email, setEmail] = useQueryState('email');
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      password: '',
      confirmPassword: '',
      otp: otp ?? ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    }),
    onSubmit: async (values) => {
      const res = await forgetPassword({
        email: values.email,
        password: values.password,
        otp: values.otp
      });
      if (res.success) {
        addToast({
          title: 'Password updated successfully',
          description: 'You can now login with your new password',
          color: 'success'
        });
        router.push(`/auth/login?email=${formik.values.email}`);
      } else {
        formik.setFieldError('password', res.message);
      }
    }
  });

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          className="sr-only"
          isDisabled
        />
        <Input
          label="New Password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          radius="lg"
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
          errorMessage={formik.errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          radius="lg"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          isInvalid={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? true
              : false
          }
          errorMessage={formik.errors.confirmPassword}
        />
        <Button
          color="primary"
          type="submit"
          isLoading={formik.isSubmitting}
          radius="lg"
          variant="shadow"
        >
          Update Password
        </Button>
        <Link
          href={`/auth/login?email=${email}`}
          className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
        >
          Back to login
        </Link>
      </form>
    </>
  );
};

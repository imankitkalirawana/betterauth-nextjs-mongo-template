'use client';
import { addToast, Button, Input, InputOtp } from '@heroui/react';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../ui/logo';
import { forgetPassword, sendOTP, verifyOTP } from '@/lib/actions/server/auth';
import { useQueryState } from 'nuqs';

export default function ForgotPassword() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [email, setEmail] = useQueryState('email');

  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      otp: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required')
    }),
    onSubmit: async (values) => {
      if (isOtpSent) {
        await verifyOTP({
          email: values.email,
          otp: values.otp,
          type: 'forget-password'
        })
          .then(() => {
            setIsVerified(true);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        await sendOTP({ email: values.email, type: 'forget-password' })
          .then(() => {
            setIsOtpSent(true);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  });

  const resendOtp = async () => {
    setIsResendingOtp(true);
    await sendOTP({ email: formik.values.email, type: 'forget-password' })
      .then(() => {
        addToast({
          title: 'Verification code sent to your email',
          color: 'success'
        });
        setIsOtpSent(true);
      })
      .catch((error) => {
        console.error(error);
        formik.setFieldError('otp', error.message);
      })
      .finally(() => {
        setIsResendingOtp(false);
      });
  };

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-6">
            <Logo />
            <p className="text-center text-small text-default-500">
              {isVerified
                ? 'Password must be atleast 8 characters'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.email}`
                  : 'Enter your email to reset your password'}
            </p>
          </div>
          {isVerified ? (
            <UpdatePassword otp={formik.values.otp} />
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={formik.handleSubmit}
            >
              {!isOtpSent && (
                <Input
                  label="Email"
                  name="email"
                  radius="lg"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    formik.setFieldValue('email', e.target.value);
                  }}
                  value={formik.values.email}
                  isInvalid={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  errorMessage={formik.errors.email}
                  isDisabled={isOtpSent}
                />
              )}

              {isOtpSent && (
                <>
                  <div className="mb-2 flex flex-col items-center justify-center">
                    <InputOtp
                      length={6}
                      name="otp"
                      radius="lg"
                      value={formik.values.otp}
                      onValueChange={(value) =>
                        formik.setFieldValue('otp', value)
                      }
                      autoFocus
                      onComplete={() => formik.handleSubmit()}
                      isInvalid={
                        formik.touched.otp && formik.errors.otp ? true : false
                      }
                      errorMessage={
                        <span className="line-clamp-1 max-w-[200px] text-sm">
                          {formik.errors.otp}
                        </span>
                      }
                    />
                    <div className="mt-4 flex flex-col items-center justify-between px-1 py-2 text-small text-default-500">
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
                  </div>
                </>
              )}

              <Button
                color="primary"
                type="submit"
                isLoading={formik.isSubmitting}
                isDisabled={
                  !formik.isValid || (isOtpSent && formik.values.otp.length < 4)
                }
                radius="lg"
                variant="shadow"
              >
                {isOtpSent ? 'Verify Otp' : 'Send Otp'}
              </Button>
              <Link
                href="/auth/login"
                className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </form>
          )}
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
      await forgetPassword({
        email: values.email,
        password: values.password,
        otp: values.otp
      }).then(() => {
        addToast({
          title: 'Password updated successfully',
          color: 'success'
        });
      });
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

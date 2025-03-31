'use client';
import { useState } from 'react';
import { Button, Link, Input, InputOtp, addToast } from '@heroui/react';
import { useFormik } from 'formik';
import { useQueryState } from 'nuqs';
import { sendOTP, verifyOTP } from '@/lib/actions/server/auth';
import * as Yup from 'yup';

import Logo from '@/components/ui/logo';

export default function Register() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useQueryState('email');
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: email ?? '',
      otp: '',
      password: '',
      confirmPassword: '',
      isChecked: false
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required')
    }),
    onSubmit: async (values) => {
      if (!values.otp) {
        await sendOTP({ email: values.email, type: 'email-verification' })
          .then(() => {
            setIsOtpSent(true);
          })
          .catch((error) => {
            console.error(error);
            formik.setFieldError('email', error.message);
          });
      } else {
        await verifyOTP({ email: values.email, otp: values.otp })
          .then(() => {
            window.location.href = '/dashboard';
          })
          .catch((error) => {
            console.error(error);
            formik.setFieldError('otp', error.message);
          });
      }
    }
  });

  const resendOtp = async () => {
    setIsResendingOtp(true);
    await sendOTP({ email: formik.values.email, type: 'email-verification' })
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
        <div className="mt-2 flex w-full max-w-sm flex-col justify-center gap-4 rounded-3xl bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-4">
            <Logo />
            <p className="text-center text-small text-default-500">
              {isVerified
                ? 'Enter your details to continue'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.email}`
                  : 'Enter your email to register'}
            </p>
          </div>
          {!isVerified && (
            <form onSubmit={formik.handleSubmit}>
              {!isOtpSent && (
                <Input
                  radius="lg"
                  label="Email"
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    formik.setFieldValue('email', e.target.value);
                  }}
                  value={formik.values.email}
                  isInvalid={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  errorMessage={formik.errors.email}
                />
              )}
              {isOtpSent && (
                <>
                  <div className="mb-2 flex flex-col items-center justify-center">
                    <InputOtp
                      radius="lg"
                      length={6}
                      name="otp"
                      value={formik.values.otp}
                      onValueChange={(value) =>
                        formik.setFieldValue('otp', value)
                      }
                      autoFocus
                      onComplete={() => formik.handleSubmit()}
                      isInvalid={
                        formik.touched.otp && formik.errors.otp ? true : false
                      }
                      errorMessage={formik.errors.otp}
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
              {!isVerified && (
                <Button
                  color="primary"
                  type="submit"
                  isLoading={formik.isSubmitting}
                  fullWidth
                  radius="lg"
                  variant="shadow"
                  className="mt-4 py-6"
                >
                  {isOtpSent ? 'Verify' : 'Send OTP'}
                </Button>
              )}
            </form>
          )}

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

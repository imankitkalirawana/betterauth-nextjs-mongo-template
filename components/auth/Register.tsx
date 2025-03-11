'use client';
import { authClient } from '@/lib/auth-client';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  InputOtp,
  Link,
  Tooltip
} from '@heroui/react';
import { useFormik } from 'formik';
import React from 'react';
import { LazyMotion, m, domAnimation, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function Register() {
  const [[page, direction], setPage] = React.useState([0, 0]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
      otpSent: false,
      otpCount: 0,
      isOtpVerified: false,
      isPasswordVisible: false,
      isConfirmPasswordVisible: false
    },
    onSubmit: async (values) => {
      // if (values.otpSent) {
      // } else {
      //   await authClient.emailOtp.sendVerificationOtp({
      //     email: values.email,
      //     type: 'sign-in' // or "email-verification", "forget-password"
      //   });
      // }
      switch (page) {
        case 0:
          await handleEmailSubmit();
          break;
        case 1:
          await verifyOtp();
          break;
        case 2:
          // handleConfirmPasswordSubmit();
          break;
        default:
          break;
      }
    }
  });

  const togglePasswordVisibility = () => {
    formik.setFieldValue('isPasswordVisible', !formik.values.isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    formik.setFieldValue(
      'isConfirmPasswordVisible',
      !formik.values.isConfirmPasswordVisible
    );
  };

  const Title = React.useCallback(
    (props: React.PropsWithChildren<{}>) => (
      <m.h1
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-medium"
        exit={{ opacity: 0, x: -10 }}
        initial={{ opacity: 0, x: -10 }}
      >
        {props.children}
      </m.h1>
    ),
    []
  );

  const titleContent = React.useMemo(() => {
    return page === 0 ? 'Sign Up' : page === 1 ? 'Enter OTP' : 'Enter Password';
  }, [page]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleEmailSubmit = async () => {
    await sendOtp();
  };

  const sendOtp = async () => {
    await authClient.emailOtp
      .sendVerificationOtp({
        email: formik.values.email,
        type: 'sign-in'
      })
      .then(() => {
        formik.setFieldValue('otpSent', true);
        paginate(1);
      })
      .catch((error) => {
        addToast({
          title: 'Error',
          description: error.message,
          color: 'danger'
        });
      });
  };

  const verifyOtp = async () => {
    console.log(formik.values.email, formik.values.otp);
    await authClient.emailOtp
      .verifyEmail({
        email: formik.values.email,
        otp: formik.values.otp
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          formik.setFieldValue('isOtpVerified', true);
          paginate(1);
        } else {
          formik.setFieldError('otp', res.error?.message || 'Invalid OTP');
        }
      });
  };

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <LazyMotion features={domAnimation}>
            <m.div className="flex min-h-[40px] items-center gap-2 pb-2">
              <AnimatePresence initial={false} mode="popLayout">
                {page >= 1 && (
                  <m.div
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    initial={{ opacity: 0, x: -10 }}
                  >
                    <Tooltip content="Go back" delay={3000}>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => paginate(-1)}
                      >
                        <Icon
                          className="text-default-500"
                          icon="solar:alt-arrow-left-linear"
                          width={16}
                        />
                      </Button>
                    </Tooltip>
                  </m.div>
                )}
              </AnimatePresence>
              <AnimatePresence custom={direction} initial={false} mode="wait">
                <Title>{titleContent}</Title>
              </AnimatePresence>
            </m.div>
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <m.form
                key={page}
                animate="center"
                className="flex flex-col gap-3"
                custom={direction}
                exit="exit"
                initial="enter"
                transition={{ duration: 0.2 }}
                variants={variants}
                onSubmit={formik.handleSubmit}
              >
                {page === 0 && (
                  <Input
                    autoFocus
                    isRequired
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                )}

                {page === 1 && (
                  <>
                    <Input
                      isRequired
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      isReadOnly
                      description={
                        <>
                          <p>
                            Not your email?{' '}
                            <span
                              className="cursor-pointer text-xs text-primary"
                              onClick={() => {
                                paginate(-1);
                              }}
                            >
                              Change Email
                            </span>
                          </p>
                        </>
                      }
                    />
                    <InputOtp
                      autoFocus
                      length={6}
                      label="Enter OTP"
                      name="otp"
                      value={formik.values.otp}
                      onChange={formik.handleChange}
                      className="mx-auto"
                      isInvalid={!!formik.errors.otp}
                      errorMessage={formik.errors.otp}
                    />
                  </>
                )}
                {page === 2 && (
                  <>
                    <Input
                      autoFocus
                      isRequired
                      endContent={
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {formik.values.isPasswordVisible ? (
                            <Icon
                              className="pointer-events-none text-2xl text-default-400"
                              icon="solar:eye-closed-linear"
                            />
                          ) : (
                            <Icon
                              className="pointer-events-none text-2xl text-default-400"
                              icon="solar:eye-bold"
                            />
                          )}
                        </button>
                      }
                      label="Password"
                      name="password"
                      type={
                        formik.values.isPasswordVisible ? 'text' : 'password'
                      }
                      value={formik.values.password}
                      onValueChange={formik.handleChange}
                    />
                  </>
                )}

                {page === 3 && (
                  <>
                    <Input
                      autoFocus
                      isRequired
                      endContent={
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {formik.values.isConfirmPasswordVisible ? (
                            <Icon
                              className="pointer-events-none text-2xl text-default-400"
                              icon="solar:eye-closed-linear"
                            />
                          ) : (
                            <Icon
                              className="pointer-events-none text-2xl text-default-400"
                              icon="solar:eye-bold"
                            />
                          )}
                        </button>
                      }
                      errorMessage={
                        formik.values.confirmPassword !== formik.values.password
                          ? 'Passwords do not match'
                          : undefined
                      }
                      label="Confirm Password"
                      name="confirmPassword"
                      type={
                        formik.values.isConfirmPasswordVisible
                          ? 'text'
                          : 'password'
                      }
                      value={formik.values.confirmPassword}
                      onValueChange={formik.handleChange}
                    />
                  </>
                )}
                <Button
                  fullWidth
                  isLoading={formik.isSubmitting}
                  color="primary"
                  type="submit"
                >
                  {page === 0
                    ? 'Continue with Email'
                    : page === 1
                      ? 'Continue with OTP'
                      : 'Continue with Password'}
                </Button>
              </m.form>
            </AnimatePresence>
          </LazyMotion>
          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="#" size="sm">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

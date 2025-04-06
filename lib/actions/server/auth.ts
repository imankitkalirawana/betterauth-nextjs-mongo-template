'use server';

import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const sendOTP = async ({
  email,
  type = 'email-verification'
}: {
  email: string;
  type?: 'email-verification' | 'sign-in' | 'forget-password';
}): Promise<{ success: boolean; message: string }> => {
  try {
    await connectDB();
    if (type === 'email-verification') {
      const user = await User.findOne({ email });
      if (user) {
        return {
          success: false,
          message: 'User already exists'
        };
      }
    } else if (type === 'sign-in' || type === 'forget-password') {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'User does not exist'
        };
      }
    }
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type
      }
    });
    return {
      success: true,
      message: 'OTP sent successfully'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.body?.message || 'An error occurred while sending the OTP'
    };
  }
};

export const verifyOTP = async ({
  email,
  otp,
  type = 'email-verification'
}: {
  email: string;
  otp: string;
  type?: 'email-verification' | 'forget-password';
}): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await auth.api.getVerificationOTP({
      query: {
        email,
        type
      }
    });
    if (res.otp === otp) {
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }
  } catch (err) {
    return {
      success: false,
      message: 'Invalid OTP'
    };
  }
};
export const forgetPassword = async ({
  email,
  password,
  otp
}: {
  email: string;
  password: string;
  otp: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email,
        password,
        otp
      }
    });

    return {
      success: true,
      message: 'Password reset successfully'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.body?.message || 'Error while resetting password'
    };
  }
};

export const register = async ({
  email,
  password,
  name
}: {
  email: string;
  password: string;
  name: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(email, password, name);
    // Step 1: Create user
    await auth.api.createUser({
      body: {
        name,
        email,
        password
      }
    });

    // Step 2: Sign in
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
        callbackUrl: '/dashboard'
      }
    });

    return {
      success: true,
      message: 'Registration completed successfully'
    };
  } catch (err: any) {
    console.error('err', err);
    return {
      success: false,
      message: err.message || 'An error occurred while registering'
    };
  }
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

import { MailOptions } from 'nodemailer/lib/json-transport';
import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { passkey } from 'better-auth/plugins/passkey';
import { admin } from 'better-auth/plugins';
import { organization } from 'better-auth/plugins';
import { emailOTP } from 'better-auth/plugins';
import { sendHTMLEmail } from '../email';
import { nextCookies } from 'better-auth/next-js';
import { OtpEmail } from '@/templates/email/auth';
import { APP_INFO } from '../config';

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }
  },

  user: {
    deleteUser: {
      enabled: true
    }
  },
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    passkey(),
    admin(),
    organization(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const MailOptions: MailOptions = {
          to: email,
          subject: `${otp} - ${APP_INFO.name} ${type === 'email-verification' ? 'Verification' : 'Reset Password'}`,
          html: OtpEmail(otp)
        };
        const emailTasks = [sendHTMLEmail(MailOptions)];
        Promise.all(emailTasks);
      }
    }),
    nextCookies()
  ]
});

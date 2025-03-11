import { transporter } from '@/lib/nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

export const defaultMailOptions: MailOptions = {
  from: {
    name: 'Divinely Developer',
    address: process.env.EMAIL as string
  },
  to: '',
  subject: '',
  html: '<h1>Hello World</h1>'
};

export const sendHTMLEmail = async (mailOptions: MailOptions) => {
  const options = { ...defaultMailOptions, ...mailOptions };

  await transporter
    .sendMail(options)
    .then(async () => {
      console.log('Email sent');
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err.message);
    });
};

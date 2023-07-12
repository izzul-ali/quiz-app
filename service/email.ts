import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const emailTransport: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});

export default function sendEmailVerification(email: string, code: string) {
  const mailOptions: SendMailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Email Verification',
    html: `
    <!doctype html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Code Email Verification</title>
    <style>
    
    </style>
    </head>
    <body>
    <h1>${code}</h1>
    </body>
    </html>
    `,
  };

  emailTransport.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw err;
    }

    console.log(info.response);
  });
}

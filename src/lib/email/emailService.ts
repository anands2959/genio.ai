import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  from?: {
    name: string;
    address: string;
  };
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  pool: true,
  maxConnections: 5
});

export const sendVerificationEmail = async (to: string, otp: string) => {
  const emailOptions: EmailOptions = {
    to,
    from: {
      name: 'Genio AI',
      address: process.env.EMAIL_USER || ''
    },
    subject: 'Verify Your Email - Genio AI',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'X-Mailer': 'Genio AI Mailer'
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <img src="https://genioai.anandsharma.info/genio-logo.svg" alt="Genio AI Logo" style="display: block; margin: 0 auto 20px; height: 40px;">
          <h2 style="color: #6B46C1; text-align: center; margin-bottom: 30px;">Welcome to Genio AI!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 20px;">Please verify your email address by entering the following verification code:</p>
          <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6B46C1; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #374151; font-size: 14px; line-height: 20px; margin-bottom: 10px;">This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 20px;">If you didn't request this verification, please ignore this email.</p>
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px;">This is an automated message from Genio AI. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(emailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
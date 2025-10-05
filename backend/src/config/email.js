import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (to, resetUrl) => {
  const appName = process.env.APP_NAME || 'RentNest';
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@rentnest.com';
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
      <h2>${appName} Password Reset</h2>
      <p>We received a request to reset your password. Click the link below to set a new password. This link will expire in 1 hour.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;
  const text = `Password reset link (expires in 1 hour): ${resetUrl}`;

  const sgApiKey = process.env.SENDGRID_API_KEY;
  if (sgApiKey) {
    try {
      sgMail.setApiKey(sgApiKey);
      const [resp] = await sgMail.send({ to, from, subject: `${appName} Password Reset`, text, html });
      console.log('Password reset email sent via SendGrid:', resp?.statusCode);
      return;
    } catch (err) {
      console.error('SendGrid send error:', err?.response?.body || err?.message || err);
      // Fallthrough to Gmail/Nodemailer if configured
    }
  }

  const gmailUser = process.env.EMAIL_USER;
  const gmailPass = process.env.EMAIL_PASS;
  if (!gmailUser || !gmailPass) {
    throw new Error('Email credentials are not configured. Set SENDGRID_API_KEY or EMAIL_USER/EMAIL_PASS.');
  }
  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailPass } });
    await transporter.verify();
    const info = await transporter.sendMail({ from, to, subject: `${appName} Password Reset`, text, html });
    console.log('Password reset email sent via Gmail SMTP:', info?.messageId || info);
  } catch (err) {
    console.error('Gmail SMTP send error:', err?.response || err?.message || err);
    throw new Error('Failed to send password reset email');
  }
};



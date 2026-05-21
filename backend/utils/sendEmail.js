import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user) throw new Error('EMAIL_USER not set in .env');
  if (!pass) throw new Error('EMAIL_PASS not set in .env');

  // Remove spaces from App Password (Gmail shows them grouped but they must be removed)
  const cleanPass = pass.replace(/\s/g, '');

  console.log(`📧 Sending email from ${user} to ${to}...`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,   // SSL on port 465 is more reliable than STARTTLS 587
    auth: {
      user,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,  // avoids self-signed cert issues
    },
  });

  const info = await transporter.sendMail({
    from: `"TradeJournal" <${user}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ Email sent! Message ID: ${info.messageId}`);
};

export default sendEmail;

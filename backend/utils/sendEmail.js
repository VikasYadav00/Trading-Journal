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

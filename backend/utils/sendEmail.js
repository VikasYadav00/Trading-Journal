const sendEmail = async ({ to, subject, html }) => {
  const payload = {
    from: 'Trading Journal <onboarding@resend.dev>',
    to: to,
    subject: subject,
    html: html
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error sending email via Resend');
  }
};

export default sendEmail;

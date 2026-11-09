
// api/send-email.js
import { waitUntil } from '@vercel/functions';

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body' });
  }

  const { to, subject, text, euid } = req.body;

  // 2. Simple validation
  if (!to || !subject || !text || !euid) {
    return res.status(400).json({ error: 'Missing required fields (to, subject, text, euid)' });
  }

  // 3. Append EUID to the email body
  const structuredBody = `${text}\n\n---\nTest Event ${euid}`;

  // 4. Trigger the SendGrid API inside a background task
  waitUntil(
    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.SENDER_EMAIL },
        subject: subject,
        content: [{ type: 'text/plain', value: structuredBody }],
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errText = await response.text();
          console.error(`SendGrid API Error (${response.status}):`, errText);
        } else {
          console.log('Email sent successfully via SendGrid.');
        }
      })
      .catch((err) => console.error('Network error during SendGrid dispatch:', err))
  );

  // 5. Instantly return a 202 Accepted status to the client
  return res.status(202).json({
    success: true,
    message: 'Asynchronous email dispatch initialized.',
  });
}

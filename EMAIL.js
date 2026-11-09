// api/send-email.js

export default async function handler(req, res) {
  // Enforce POST method for test compatibility
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Explicit hardcoded string configuration to bypass JavaScript dot notation errors
    const AUTH_HEADER = "Bearer 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";

    const sendgridResponse = await fetch('https://sendgrid.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_HEADER
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'Salmabankole@gmail.com' }]
          }
        ],
        from: { email: 'sandybeach1084@gmail.com' }, 
        subject: 'Serverless Verified - SDB0394EVENTTESTEVENT', 
        content: [
          {
            type: 'text/plain',
            value: 'Serverless deployment completed successfully outside of AWS/Azure.'
          }
        ]
      })
    });

    if (sendgridResponse.ok) {
      console.log('Email successfully accepted by SendGrid.');
      return res.status(200).json({ success: true, message: 'Email successfully accepted by SendGrid.' });
    } else {
      const errorText = await sendgridResponse.text();
      console.error('SendGrid error status:', sendgridResponse.status);
      console.error('SendGrid response body:', errorText);
      return res.status(sendgridResponse.status).json({ error: errorText });
    }

  } catch (error) {
    console.error('Runtime processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: 'Salmabankole@gmail.com' }]
    }],
    from: { email: 'sandybeach1084@gmail.com' },
    subject: 'Serverless Verified - SDB0394EVENTTESTEVENT',
    content: [{
      type: 'text/plain',
      value: 'Serverless deployment completed successfully outside of AWS/Azure.'
    }]
  })
});

if (sendgridResponse.ok) {
  console.log('Email successfully accepted by SendGrid.');
} else {
  console.error('SendGrid error:', await sendgridResponse.text());
}

// api/get-premium.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    const tokenRes = await fetch('https://serviceuat.nivabupa.com:82/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'TkJISV9QcmVtaXVtU2VydmljZV9SZUFzc3VyZTIuMF9DbGllbnQ=',
        client_secret: 'TkJISV9QcmVtaXVtU2VydmljZV9SZUFzc3VyZTIuMF9TZWNyZXQyJQ==',
        scope: 'MaxbupaApiScope'
      })
    });

    const tokenText = await tokenRes.text();
    console.log("🧾 Raw Token Response:", tokenText);

    return res.status(500).json({
      error: 'Token response is not JSON',
      html: tokenText
    });
  } catch (error) {
    console.error("💥 Server Error:", error);
    return res.status(500).json({
      error: 'Internal server error',
      detail: error.message
    });
  }
};

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ node-fetch v2 supports require()

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/get-premium', async (req, res) => {
  try {
    console.log("BODY:", req.body);

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

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("Access token not received");
    }

    const premiumRes = await fetch('https://serviceuat.nivabupa.com:83/api/ReAssure2.0/GetPremium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(req.body)
    });

    const premiumData = await premiumRes.json();
    console.log("PREMIUM RESPONSE:", premiumData);
    res.json(premiumData);
  } catch (err) {
    console.error("💥 SERVER ERROR:", err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});

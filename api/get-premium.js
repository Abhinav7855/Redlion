// api/get-premium.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
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

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("Token not received");

    const premiumRes = await fetch('https://serviceuat.nivabupa.com:83/api/ReAssure2.0/GetPremium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(req.body)
    });

    const premiumData = await premiumRes.json();
    res.status(200).json(premiumData);
  } catch (error) {
    res.status(500).json({ error: 'Internal error', detail: error.message });
  }
}

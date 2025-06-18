// api/get-premium.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    // 1. Log incoming request
    console.log("➡️ Incoming request body:", req.body);

    // 2. Get token from Niva Bupa
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
    console.log("🟢 Token Response:", tokenData);

    if (!tokenData.access_token) {
      return res.status(500).json({ error: 'Failed to get access token', tokenData });
    }

    const accessToken = tokenData.access_token;

    // 3. Validate the request payload
    const requiredFields = ['DOB', 'Gender', 'MobileNo', 'EmailId', 'Pincode', 'SumInsured', 'Smoking', 'FullName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missingFields });
    }

    // 4. Prepare and log the final request body
    const requestBody = {
      DOB: req.body.DOB,
      Gender: req.body.Gender,
      MobileNo: req.body.MobileNo,
      EmailId: req.body.EmailId,
      Pincode: req.body.Pincode,
      SumInsured: req.body.SumInsured,
      Smoking: req.body.Smoking,
      FullName: req.body.FullName
    };

    console.log("📦 Final Payload sent to GetPremium API:", requestBody);

    // 5. Call GetPremium API
    const premiumRes = await fetch('https://serviceuat.nivabupa.com:83/api/ReAssure2.0/GetPremium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    const premiumData = await premiumRes.json();
    console.log("✅ Premium API Response:", premiumData);

    res.status(200).json(premiumData);
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    res.status(500).json({
      error: 'Internal error',
      detail: error.message || 'Unknown error'
    });
  }
}

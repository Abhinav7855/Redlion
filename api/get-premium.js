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

// 🔍 Debug the raw HTML or error content
const tokenText = await tokenRes.text();
console.log("🧾 Raw Token Response:", tokenText);
res.status(500).json({ error: 'Token response is not JSON', html: tokenText });
return;

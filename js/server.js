// backend/server.js

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/bajaj-quote", async (req, res) => {
  try {
    const response = await axios.post(
      "https://balicsit.bajajallianz.com/BalicWSRest/BalicWSRest_UAT4",
      req.body,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "API call failed", details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

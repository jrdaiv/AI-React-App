require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",  // Allow requests from anywhere (for development)
  methods: ["GET", "POST"]
}));



const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.get("/", (req, res) => {
  res.send("Backend is now running! ");
});


app.get("/api/data", (req, res) => {
  res.json({ message: "API is working!" });
});


app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: message }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Check if response data exists
    if (!response.data.candidates || response.data.candidates.length === 0) {
      return res.status(500).json({ error: "Invalid response from Gemini API" });
    }

    const botResponse = response.data.candidates[0]?.content?.parts?.[0]?.text || "No response from AI";

    res.json({ reply: botResponse });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Oops, something went wrong. Please try again" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

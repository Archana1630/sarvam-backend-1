import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route (to check backend is working)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Transcription API (Sarvam)
app.post("/transcribe", async (req, res) => {
  try {
    const { audioUrl } = req.body;

    const response = await axios.post(
      "https://api.sarvam.ai/transcribe",
      { audio_url: audioUrl },
      {
        headers: {
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
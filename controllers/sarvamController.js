import axios from "axios";
import FormData from "form-data";

const BASE_URL = "https://api.sarvam.ai";

/* ---------------- SPEECH TO TEXT ---------------- */

export const speechToText = async (req, res) => {
  try {
    console.log("🔥 HIT /speech-to-text");

    const file = req.files?.file;
    const language_code = req.body.language_code;

    // ================== LOGGING ==================
    const startTime = Date.now();
    const now = new Date();

    console.log("========================================");
    console.log("📅 Date:", now.toLocaleDateString());
    console.log("🕒 Time:", now.toLocaleTimeString());
    console.log("📄 File Name:", file?.name);
    console.log(
      "📦 File Size:",
      file ? (file.size / 1024).toFixed(2) + " KB" : "N/A"
    );
    console.log(
      "📂 File Location:",
      file?.tempFilePath || "Stored In Memory"
    );
    console.log("🌍 Language:", language_code);
    console.log("========================================");
    // ============================================

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!process.env.SARVAM_API_KEY) {
      return res.status(500).json({ error: "Missing API Key" });
    }

    const formData = new FormData();

    formData.append("file", file.data, {
      filename: file.name,
    });

    formData.append("language_code", language_code);

    const response = await axios.post(
      `${BASE_URL}/speech-to-text`,
      formData,
      {
        headers: {
          "api-subscription-key": process.env.SARVAM_API_KEY,
          ...formData.getHeaders(),
        },
      }
    );

    console.log("🔥 Sarvam Response:", response.data);

    // ================== LOGGING ==================
    const endTime = Date.now();

    console.log("----------------------------------------");
    console.log("📝 Transcript:", response.data.transcript);
    console.log("⏱ Processing Time:", endTime - startTime, "ms");
    console.log("----------------------------------------");
    // ============================================

    return res.json(response.data);
  } catch (error) {
    console.log(
      "❌ STT ERROR:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      error: "Speech to text failed",
    });
  }
};

/* ---------------- TRANSLATE ---------------- */

export const translateText = async (req, res) => {
  try {
    const {
      input,
      source_language_code,
      target_language_code,
    } = req.body;

    // ================== LOGGING ==================
    const startTime = Date.now();
    const now = new Date();

    console.log("========================================");
    console.log("📅 Date:", now.toLocaleDateString());
    console.log("🕒 Time:", now.toLocaleTimeString());
    console.log("🌐 Route: /translate");
    console.log("🌍 Source Language:", source_language_code);
    console.log("🎯 Target Language:", target_language_code);
    console.log("📝 Input:", input);
    console.log("========================================");
    // ============================================

    const response = await axios.post(
      `${BASE_URL}/translate`,
      {
        input,
        source_language_code,
        target_language_code,
      },
      {
        headers: {
          "api-subscription-key": process.env.SARVAM_API_KEY,
        },
      }
    );

    // ================== LOGGING ==================
    const endTime = Date.now();

    console.log("✅ Translation:", response.data);
    console.log("⏱ Processing Time:", endTime - startTime, "ms");
    console.log("========================================");
    // ============================================

    return res.json(response.data);
  } catch (error) {
    console.log(
      "❌ TRANSLATE ERROR:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      error: "Translation failed",
    });
  }
};
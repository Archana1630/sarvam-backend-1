import axios from "axios";
import FormData from "form-data";

const BASE_URL = "https://api.sarvam.ai";

/* ---------------- SPEECH TO TEXT ---------------- */

export const speechToText = async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("🎤 SPEECH TO TEXT REQUEST");
    console.log("========================================");

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    console.log("📅 Request Time :", timestamp);

    const file = req.files?.file;
    const language_code = req.body.language_code;

    const startTime = Date.now();

    if (!file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    if (!process.env.SARVAM_API_KEY) {
      return res.status(500).json({
        error: "Missing API Key",
      });
    }

    console.log("📄 File Name      :", file.name);
    console.log(
      "📦 File Size      :",
      (file.size / 1024).toFixed(2),
      "KB"
    );
    console.log(
      "📂 File Location  :",
      file.tempFilePath || "Stored In Memory"
    );
    console.log("🌍 Language       :", language_code);

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

    const endTime = Date.now();

    console.log("----------------------------------------");
    console.log("📝 Transcript     :", response.data.transcript);
    console.log("🌍 Detected Lang  :", response.data.language_code);
    console.log("⏱ Processing Time :", endTime - startTime, "ms");
    console.log("========================================\n");

    return res.json(response.data);
  } catch (error) {
    console.log("\n========================================");
    console.log("❌ SPEECH TO TEXT ERROR");
    console.log("----------------------------------------");
    console.log(error?.response?.data || error.message);
    console.log("========================================\n");

    return res.status(500).json({
      error: "Speech to text failed",
    });
  }
};

/* ---------------- TRANSLATE ---------------- */

export const translateText = async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("🌐 TRANSLATION REQUEST");
    console.log("========================================");

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    console.log("📅 Request Time :", timestamp);

    const {
      input,
      source_language_code,
      target_language_code,
    } = req.body;

    const startTime = Date.now();

    console.log("🌍 Source Language :", source_language_code);
    console.log("🎯 Target Language :", target_language_code);
    console.log("📝 Input Text      :", input);

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

    const endTime = Date.now();

    console.log("----------------------------------------");
    console.log("✅ Translation    :", response.data);
    console.log("⏱ Processing Time :", endTime - startTime, "ms");
    console.log("========================================\n");

    return res.json(response.data);
  } catch (error) {
    console.log("\n========================================");
    console.log("❌ TRANSLATION ERROR");
    console.log("----------------------------------------");
    console.log(error?.response?.data || error.message);
    console.log("========================================\n");

    return res.status(500).json({
      error: "Translation failed",
    });
  }
};
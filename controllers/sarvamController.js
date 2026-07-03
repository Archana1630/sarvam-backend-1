export const speechToText = async (req, res) => {
  try {
    console.log("🔥 HIT /speech-to-text");

    const file = req.files?.file;
    const language_code = req.body.language_code;

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
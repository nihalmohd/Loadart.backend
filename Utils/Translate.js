import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_TRANSLATE_API = "https://translation.googleapis.com/language/translate/v2";

export const translateText = async (text, targetLang) => {
  // Skip translation if no text or English requested
  if (!text || targetLang === "en") return text;

  // Ensure the API key is present
  const apiKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!apiKey) {
    console.error("Missing Google Translate API key in environment variables.");
    return text;
  }

  try {
    // Prepare payload
    const payload = {
      q: Array.isArray(text) ? text : [text],
      target: targetLang,
      format: "text",
    };

    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API}?key=${apiKey}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract translated text(s)
    const translations = response.data.data.translations.map((t) => t.translatedText);
    return Array.isArray(text) ? translations : translations[0];
  } catch (error) {
    console.error("Google Translate API error:", error.response?.data || error.message);
    return text;
  }
};


export const translateToEnglish = async (text) => {
  if (!text || typeof text !== "string" || text.trim() === "") return text;

  const apiKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!apiKey) {
    console.error("Missing Google Translate API Key");
    return text;
  }

  try {
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API}?key=${apiKey}`,
      {
        q: [text],
        target: "en",
        format: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const translated = response?.data?.data?.translations?.[0]?.translatedText;
    return translated || text;
  } catch (err) {
    console.error("Translate to English error:", err.response?.data || err.message);
    return text;
  }
};

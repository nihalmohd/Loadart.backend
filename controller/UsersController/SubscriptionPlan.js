import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getPlansByUserType = async (req, res) => {
  const { userTypeId, lang = "en" } = req.query;

  if (!userTypeId) {
    return res.status(400).json({ message: "userTypeId is required." });
  }

  try {
    const query = `
      SELECT *
      FROM loadart."SubscriptionPlan"
      WHERE $1 = ANY(string_to_array("userTypeIds", ','))
    `;

    const result = await pool.query(query, [userTypeId]);

    let translatedData = result.rows;

    if (lang !== "en") {
      translatedData = await Promise.all(
        result.rows.map(async (item) => {
          const translatedName = await translateText(item.name, lang);
          const translatedFeatures = await translateText(item.features, lang);
          const translatedDuration = item.duration ? await translateText(item.duration, lang) : item.duration;
          const translatedDescription = item.description
            ? await translateText(item.description, lang)
            : null;

          return {
            ...item,
            name: translatedName,
            features: translatedFeatures,
            description: translatedDescription,
            duration: translatedDuration,
          };
        })
      );
    }

    res.status(200).json({
      message: "Plans retrieved successfully.",
      data: translatedData,
    });
  } catch (error) {
    console.error("Error retrieving plans:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

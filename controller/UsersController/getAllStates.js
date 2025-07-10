import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getAllStates = async (req, res) => {
    const lang = req.query.lang || "en";

    const fetchStatesQuery = `
      SELECT * FROM loadart.states
      ORDER BY states_id DESC;
    `;

    try {
        const result = await pool.query(fetchStatesQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No states found in the table." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            // Translate each state's name to requested language
            translatedData = await Promise.all(
                result.rows.map(async (state) => {
                    const translatedName = await translateText(state.states_name, lang);
                    return {
                        ...state,
                        states_name: translatedName,
                    };
                })
            );
        }

        res.status(200).json({
            message: "States retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving states:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

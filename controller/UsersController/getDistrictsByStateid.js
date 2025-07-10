import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getDistrictsByStateId = async (req, res) => {
    const { states_id, lang = "en" } = req.query;

    if (!states_id) {
        return res.status(400).json({ message: "State ID is required." });
    }

    const fetchDistrictsQuery = `
        SELECT *
        FROM loadart.districts
        WHERE "states_id" = $1
        ORDER BY "districts_id" DESC;
    `;

    try {
        const result = await pool.query(fetchDistrictsQuery, [states_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No districts found for the given state ID." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(
                result.rows.map(async (district) => {
                    const translatedName = await translateText(district.districts_name, lang);
                    return {
                        ...district,
                        districts_name: translatedName,
                    };
                })
            );
        }

        res.status(200).json({
            message: "Districts retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving districts:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

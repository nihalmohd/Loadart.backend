import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getAllMaterials = async (req, res) => {
    const { lang = "en" } = req.query;

    const fetchMaterialsQuery = `
        SELECT *
        FROM loadart.materials
        ORDER BY "materials_id" DESC;
    `;

    try {
        const result = await pool.query(fetchMaterialsQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No materials found." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(
                result.rows.map(async (item) => {
                    const translatedName = await translateText(item.materials_name, lang);
                    return {
                        ...item,
                        materials_name: translatedName,
                    };
                })
            );
        }

        res.status(200).json({
            message: "Materials retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving materials:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

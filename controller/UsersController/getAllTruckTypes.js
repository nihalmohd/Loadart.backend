import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getAllTruckTypes = async (req, res) => {
    const { lang = "en" } = req.query;

    const fetchTruckTypesQuery = `
        SELECT *
        FROM loadart.truck_types  
        ORDER BY "truck_types_id" DESC;
    `;

    try {
        const result = await pool.query(fetchTruckTypesQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No truck types found." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(
                result.rows.map(async (item) => {
                    const translatedName = await translateText(item.truck_types_name, lang);
                    return {
                        ...item,
                        truck_types_name: translatedName,
                    };
                })
            );
        }

        res.status(200).json({
            message: "Truck types retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving truck types:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

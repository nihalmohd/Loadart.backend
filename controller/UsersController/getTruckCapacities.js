import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getAllTruckCapacities = async (req, res) => {
    const { lang = "en" } = req.query;

    const fetchTruckCapacitiesQuery = `
        SELECT *
        FROM loadart.truck_capacities
        ORDER BY "truck_capacities_id" DESC;
    `;

    try {
        const result = await pool.query(fetchTruckCapacitiesQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No truck capacities found." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(
                result.rows.map(async (item) => {
                    const translatedName = await translateText(item.truck_capacities_name, lang);
                    return {
                        ...item,
                        truck_capacities_name: translatedName,
                    };
                })
            );
        }

        res.status(200).json({
            message: "Truck capacities retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving truck capacities:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

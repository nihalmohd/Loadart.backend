import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getTruckBidsForUser = async (req, res) => {
    const { user_id, lang = "en" } = req.query;

    try {
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required." });
        }

        const query = `
            SELECT 
                bt.*, 
                u.*, 
                l.*, 
                t.* 
            FROM 
                Loadart."bidsTruck" bt
            JOIN 
                Loadart."users" u ON bt.user_id = u.users_id
            JOIN 
                Loadart."loads" l ON bt.loads_id = l.loads_id
            JOIN 
                Loadart."trucks" t ON bt.trucks_id = t.truck_id
            WHERE 
                bt.user_id = $1
            ORDER BY 
                bt."bidsTruck_id" DESC;
        `;

        const result = await pool.query(query, [user_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No bids found for the given user_id." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(
                result.rows.map(async (item) => ({
                    ...item,
                    users_name: item.users_name ? await translateText(item.users_name, lang) : null,
                    pickupLoc: item.pickupLoc ? await translateText(item.pickupLoc, lang) : null,
                    deliveryLoc: item.deliveryLoc ? await translateText(item.deliveryLoc, lang) : null,
                }))
            );
        }

        res.status(200).json({
            message: "Bids retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving bids for user and truck:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
    
import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getTruckBidsWithDetails = async (req, res) => {
    const { trucks_id, user_id, lang = "en" } = req.query;

    try {
        if (!trucks_id || !user_id) {
            return res.status(400).json({ message: "trucks_id and user_id are required." });
        }

        const query = `
            SELECT 
                bl."bidsLoad_id", 
                bl."bidsLoad_amount", 
                bl."bidsLoad_status", 
                u.users_name, 
                u.users_id, 
                t.truck_id,  
                t."regNumber",  
                t.user_id AS user_id,
                l.loads_id, 
                l."pickupLoc",
                l."deliveryLoc",
                l."pickupDate", 
                tt.truck_types_name, 
                m.materials_id,
                m.materials_name, 
                tc.truck_capacities_name
            FROM 
                Loadart."bidsLoad" bl
            LEFT JOIN 
                Loadart."users" u ON bl.user_id = u.users_id
            LEFT JOIN 
                Loadart."trucks" t ON bl."trucks_id" = t."truck_id"
            LEFT JOIN 
                Loadart."loads" l ON bl.load_id = l.loads_id
            LEFT JOIN 
                Loadart."truck_types" tt ON t."trucks_type_id" = tt."truck_types_id"
            LEFT JOIN 
                Loadart."materials" m ON l."material_id" = m."materials_id"  
            LEFT JOIN 
                Loadart."truck_capacities" tc ON t."capacity_id" = tc."truck_capacities_id"
            LEFT JOIN 
                Loadart."postTrucks" pt ON t."truck_id" = pt."truck_id"
            WHERE 
                bl."trucks_id" = $1
                AND bl."bidsLoad_status" NOT IN ('3', '4')
                AND bl.user_id != $2
            ORDER BY 
                bl."bidsLoad_id" DESC;
        `;

        const result = await pool.query(query, [trucks_id, user_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No bids found for the given trucks_id." });
        }

        let translatedData = result.rows;

        if (lang !== "en") {
            translatedData = await Promise.all(
                result.rows.map(async (item) => ({
                    ...item,
                    pickupLoc: item.pickupLoc ? await translateText(item.pickupLoc, lang) : null,
                    users_name: item.users_name ? await translateText(item.users_name, lang) : null,
                    deliveryLoc: item.deliveryLoc ? await translateText(item.deliveryLoc, lang) : null,
                    truck_types_name: item.truck_types_name ? await translateText(item.truck_types_name, lang) : null,
                    materials_name: item.materials_name ? await translateText(item.materials_name, lang) : null,
                    truck_capacities_name: item.truck_capacities_name ? await translateText(item.truck_capacities_name, lang) : null,
                }))
            );
        }

        res.status(200).json({
            message: "Bids retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving bids for truck:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

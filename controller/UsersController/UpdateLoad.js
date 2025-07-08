import pool from "../../Model/Config.js";
import { translateToEnglish } from "../../Utils/Translate.js";

export const updateLoad = async (req, res) => {
    try {
        let { loads_id, pickupLoc, deliveryLoc, pickupDate, material_id, truck_type_id, capacity_id } = req.body;

        if (!loads_id) {
            return res.status(400).json({ message: "loads_id is required" });
        }

        // Translate pickup and delivery locations to English before storing
        if (pickupLoc) pickupLoc = await translateToEnglish(pickupLoc);
        if (deliveryLoc) deliveryLoc = await translateToEnglish(deliveryLoc);

        const query = `
            UPDATE Loadart."loads"
            SET 
                "pickupLoc" = $1, 
                "deliveryLoc" = $2, 
                "pickupDate" = $3, 
                "material_id" = $4, 
                "truck_type_id" = $5, 
                "capacity_id" = $6
            WHERE "loads_id" = $7
            RETURNING *;
        `;

        const values = [pickupLoc, deliveryLoc, pickupDate, material_id, truck_type_id, capacity_id, loads_id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Load not found" });
        }

        res.status(200).json({ message: "Load updated successfully", data: result.rows[0] });

    } catch (error) {
        console.error("Error updating load:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

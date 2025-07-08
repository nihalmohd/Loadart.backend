import pool from "../../Model/Config.js";
import { translateToEnglish } from "../../Utils/Translate.js";

export const updateTruck = async (req, res) => {
    try {
        let { truck_id, regNumber, trucks_type_id, capacity_id, location } = req.body;

        if (!truck_id) {
            return res.status(400).json({ message: "truck_id is required" });
        }

        // Translate location to English before storing
        if (location) {
            location = await translateToEnglish(location);
        }

        const updateQuery = `
            UPDATE loadart.trucks
            SET 
                "regNumber" = $1, 
                "trucks_type_id" = $2, 
                "capacity_id" = $3, 
                "location" = $4, 
                "updatedAt" = NOW()
            WHERE 
                truck_id = $5
            RETURNING *;
        `;

        const values = [regNumber, trucks_type_id, capacity_id, location, truck_id];

        const { rows } = await pool.query(updateQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Truck not found" });
        }

        res.status(200).json({ message: "Truck updated successfully", data: rows[0] });
    } catch (error) {
        console.error("Error updating truck:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

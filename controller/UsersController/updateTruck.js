import pool from "../../Model/Config.js";

export const updateTruck = async (req, res) => {
    try {
        const { truck_id, regNumber, trucks_type_id, capacity_id, model_id, manufacturer_id, location } = req.body;

        if (!truck_id) {
            return res.status(400).json({ message: "truck_id is required" });
        }

        const updateQuery = `
            UPDATE trucks
            SET regNumber = $1, trucks_type_id = $2, capacity_id = $3, model_id = $4, manufacturer_id = $5, location = $6, updatedAt = NOW()
            WHERE truck_id = $7
            RETURNING *;
        `;

        const values = [regNumber, trucks_type_id, capacity_id, model_id, manufacturer_id, location, truck_id];

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
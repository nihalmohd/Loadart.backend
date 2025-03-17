import pool from "../../Model/Config.js";

export const deleteTruck = async (req, res) => {
    try {
        const { truck_id } = req.body;

        if (!truck_id) {
            return res.status(400).json({ message: "truck_id is required" });
        }

        const deleteQuery = `
            DELETE FROM trucks
            WHERE truck_id = $1
            RETURNING *;
        `;

        const { rows } = await pool.query(deleteQuery, [truck_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Truck not found" });
        }

        res.status(200).json({ message: "Truck deleted successfully", data: rows[0] });
    } catch (error) {
        console.error("Error deleting truck:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
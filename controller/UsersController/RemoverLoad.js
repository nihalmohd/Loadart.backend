import pool from "../../Model/Config.js";

export const deleteLoad = async (req, res) => {
    try {
        const { loads_id } = req.body;

        if (!loads_id) {
            return res.status(400).json({ message: "loads_id is required" });
        }

        const query = `
            DELETE FROM Loadart."loads"
            WHERE "loads_id" = $1
            RETURNING *;
        `;

        const values = [loads_id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Load not found" });
        }

        res.status(200).json({ message: "Load deleted successfully", data: result.rows[0] });

    } catch (error) {
        console.error("Error deleting load:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../Model/Config.js";

export const getTrucksByUserId = async (req, res) => {
    const { user_id } = req.query; 
    const limit = 20;

    if (!user_id) {
        return res.status(400).json({ message: "user_id is required in query parameters." });
    }

    const fetchTrucksQuery = `
        SELECT *
        FROM loadart.trucks
        WHERE "user_id" = $1
        LIMIT $2;
    `;

    try {
        const result = await pool.query(fetchTrucksQuery, [user_id, limit]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No trucks found for the given user_id." });
        }

        res.status(200).json({
            message: "Trucks retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving trucks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

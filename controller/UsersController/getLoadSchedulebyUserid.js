import pool from "../../Model/Config.js";


export const getLoadSchedulesByUser = async (req, res) => {
    const { users_id } = req.query;

    try {
        // Check if users_id is provided
        if (!users_id) {
            return res.status(400).json({ message: "users_id is required." });
        }

        // SQL query to fetch data by users_id
        const query = `
            SELECT * 
            FROM Loadart."load_schedules"
            WHERE "users_id" = $1;
        `;

        // Execute query
        const result = await pool.query(query, [users_id]);

        // Check if no data found
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found for the given users_id." });
        }

        // Send response
        res.status(200).json({
            message: "Data retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving load schedules:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../../Model/Config.js";

export const getLoadSchedulesByUser = async (req, res) => {
    const { users_id } = req.query;

    try {
        // Check if users_id is provided
        if (!users_id) {
            return res.status(400).json({ message: "users_id is required." });
        }

        // SQL query to join load_schedules with trucks based on truck_id
        const query = `
        SELECT 
            schedules.*, 
            trucks.*, 
            materials.*
        FROM 
            Loadart."load_schedules" AS schedules
        LEFT JOIN 
            Loadart."trucks" AS trucks
        ON 
            schedules."truck_id" = trucks."truck_id"
        LEFT JOIN 
            Loadart."materials" AS materials
        ON 
            schedules."materials_id" = materials."materials_id"
        WHERE 
            schedules."users_id" = $1;
    `;
    

        // Execute query
        const result = await pool.query(query, [users_id]);

        // Check if no data found
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found for the given users_id.",data:[] });
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

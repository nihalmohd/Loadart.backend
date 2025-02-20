import pool from "../../Model/Config.js";

export const getLoadSchedulesByUser = async (req, res) => {
    const { users_id, date_filter } = req.query;
         console.log(date_filter,users_id,"hello");
         
    try {
        // Check if users_id is provided
        if (!users_id) {
            return res.status(400).json({ message: "users_id is required." });
        }

        // Base query
        let query = `
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
            schedules."users_id" = $1
        `;

        const queryParams = [users_id]; 

        // Apply date filter conditions
        if (date_filter) {
            let dateCondition = "";
            if (date_filter === "last_day") {
                dateCondition = `AND schedules."schedules_date" >= NOW() - INTERVAL '1 day'`;
            } else if (date_filter === "last_30_days") {
                dateCondition = `AND schedules."schedules_date" >= NOW() - INTERVAL '30 days'`;
            } else if (date_filter === "last_6_months") {
                dateCondition = `AND schedules."schedules_date" >= NOW() - INTERVAL '6 months'`;
            } else if (date_filter === "last_year") {
                dateCondition = `AND schedules."schedules_date" >= NOW() - INTERVAL '1 year'`;
            }

            query += ` ${dateCondition}`;
        }

        // Execute query
        const result = await pool.query(query, queryParams);

        // Check if no data found
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found for the given criteria.", data: [] });
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

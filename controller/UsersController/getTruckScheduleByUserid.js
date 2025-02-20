import pool from "../../Model/Config.js";

export const getTruckSchedulesByUserId = async (req, res) => {
    const { user_id, date_filter } = req.query;

    try {
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required." });
        }

        // Base query with LEFT JOIN (to avoid missing data issues)
        let query = `
      SELECT 
    schedules.*, 
    trucks.*, 
    loads.*, 
    materials.*
FROM 
    Loadart."truck_schedules" AS schedules
LEFT JOIN 
    Loadart."trucks" AS trucks
ON 
    schedules."trucks_id" = trucks."truck_id"
LEFT JOIN 
    Loadart."loads" AS loads
ON 
    schedules."loads_id" = loads."loads_id"::BIGINT  -- Ensure correct type
LEFT JOIN 
    Loadart."materials" AS materials
ON 
    loads."material_id"::TEXT = materials."materials_id"::TEXT  -- Convert both to TEXT
WHERE 
    schedules."user_id" = $1`;

        const queryParams = [user_id];

        // Apply date filter conditions
        if (date_filter) {
            let dateCondition = "";
            if (date_filter === "last_day") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '1 day'`;
            } else if (date_filter === "last_30_days") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '30 days'`;
            } else if (date_filter === "last_6_months") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '6 months'`;
            } else if (date_filter === "last_year") {
                dateCondition = `AND schedules."truckSchedules_date" >= NOW() - INTERVAL '1 year'`;
            }

            query += ` ${dateCondition}`;
        }



        // Execute query
        const result = await pool.query(query, queryParams);

        // Check if no data found
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No schedules found for the given criteria.", data: [] });
        }

        // Send response
        res.status(200).json({
            message: "Truck schedules fetched successfully.",
            schedules: result.rows,
        });
    } catch (error) {
        console.error("Error fetching truck schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

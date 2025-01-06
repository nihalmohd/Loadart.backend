import pool from "../../Model/Config.js";

export const getTruckSchedulesByUserId = async (req, res) => {
    const { user_id } = req.query; 

    try {
        
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required." });
        }

        
        const query = `
            SELECT * 
            FROM Loadart."truck_schedules"
            WHERE "user_id" = $1;
        `;

        
        const result = await pool.query(query, [user_id]);

        
        if (result.rowCount === 0) {
            return res.status(200).json({ message: "No schedules found for the given user_id." });
        }

        
        res.status(200).json({
            message: "Truck schedules fetched successfully.",
            schedules: result.rows,
        });
    } catch (error) {
        console.error("Error fetching truck schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

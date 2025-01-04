import pool from "../Model/Config.js";

export const getTruckBidsWithDetails = async (req, res) => {
    const { postTruck_id } = req.query;

    try {
        // Validate required parameter
        if (!postTruck_id) {
            return res.status(400).json({ message: "postTruck_id is required." });
        }

        // SQL Query to join and fetch matching rows
        const query = `
            SELECT 
                bt.*, 
                u.*, 
                pt.*, 
                l.* 
            FROM 
                Loadart."bidsTruck" bt
            JOIN 
                Loadart."users" u
            ON 
                bt.user_id = u.users_id
            JOIN 
                Loadart."postTrucks" pt
            ON 
                bt."postTrucks_id" = pt."postTrucks_id"
            JOIN 
                Loadart."loads" l
            ON 
                bt.loads_id = l.loads_id
            WHERE 
                bt."postTrucks_id" = $1;
        `;

        // Execute query with postTruck_id parameter
        const result = await pool.query(query, [postTruck_id]);

        // Handle case where no matching rows are found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No bids found for the given postTruck_id." });
        }

        // Return successful response with data
        res.status(200).json({
            message: "Bids retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving bids for truck:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

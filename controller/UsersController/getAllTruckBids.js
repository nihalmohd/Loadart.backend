import pool from "../../Model/Config.js";

export const getTruckBidsWithDetails = async (req, res) => {
    const { postTruck_id } = req.query;

    try {
        
        if (!postTruck_id) {
            return res.status(400).json({ message: "postTruck_id is required." });
        }

        
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

       
        const result = await pool.query(query, [postTruck_id]);

        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No bids found for the given postTruck_id." });
        }

        
        res.status(200).json({
            message: "Bids retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving bids for truck:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

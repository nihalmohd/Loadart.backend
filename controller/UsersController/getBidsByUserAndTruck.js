import pool from "../../Model/Config.js";

export const getTruckBidsForUserAndPostTruck = async (req, res) => {
    const { user_id, trucks_id } = req.query;

    try {
        if (!user_id || !trucks_id) {
            return res.status(400).json({ message: "Both user_id and trucks_id are required." });
        }

        const query = `
            SELECT 
                bl.*, 
                u.*,  
                l.*, 
                t.* 
            FROM 
                Loadart."bidsLoad" bl
            JOIN 
                Loadart."users" u
            ON 
                bl.user_id = u.users_id

            JOIN 
                Loadart."loads" l
            ON 
                bl.load_id = l.loads_id
            JOIN 
                Loadart."trucks" t
            ON 
                bl.trucks_id = t.truck_id
            WHERE 
                bl.user_id = $1 AND bl."trucks_id" = $2;
        `;

        const result = await pool.query(query, [user_id, trucks_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No bids found for the given user_id and trucks_id." });
        }

        res.status(200).json({
            message: "Bids retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving bids for user and truck:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
 
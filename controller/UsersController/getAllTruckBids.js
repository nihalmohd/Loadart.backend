import pool from "../../Model/Config.js";

export const getTruckBidsWithDetails = async (req, res) => {
    const { trucks_id } = req.query;

    try {
        
        if (!trucks_id) {
            return res.status(400).json({ message: "trucks_id is required." });
        }

        
        const query = `
            SELECT 
                bl.*, 
                u.*, 
                t.*, 
                l.* 
            FROM 
                Loadart."bidsLoad" bl
            JOIN 
                Loadart."users" u
            ON 
                bl.user_id = u.users_id
            JOIN 
                Loadart."trucks" t
            ON 
                bl."trucks_id" = t."truck_id"
            JOIN 
                Loadart."loads" l
            ON 
                bl.load_id = l.loads_id
            WHERE 
                bl."trucks_id" = $1;
        `;

       
        const result = await pool.query(query, [trucks_id]);

        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No bids found for the given trucks_id." });
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

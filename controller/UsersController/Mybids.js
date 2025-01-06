import pool from "../../Model/Config.js";

export const myBids = async (req, res) => {
    const { load_id, user_id } = req.query;

    try {
        
        if (!load_id || !user_id) {
            return res.status(400).json({ message: "Both load_id and user_id are required." });
        }

        
        const query = `
            SELECT 
                bl.*,
                u.*, 
                pt.*, 
                l.*
            FROM 
                Loadart."bidsLoad" bl
            JOIN 
                Loadart."users" u
            ON 
                bl.user_id = u.users_id
            JOIN 
                Loadart."postTrucks" pt
            ON 
                bl."postTrucks_id" = pt."postTrucks_id"
            JOIN 
                Loadart."loads" l
            ON 
                bl.load_id = l.loads_id
            WHERE 
                bl.load_id = $1 AND bl.user_id = $2;
        `;

        
        const result = await pool.query(query, [load_id, user_id]);

        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found for the given load_id and user_id." });
        }

        
        return res.status(200).json({
            message: "Data retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving bidsLoad data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

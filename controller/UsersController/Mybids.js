import pool from "../../Model/Config.js";

export const myBids = async (req, res) => {
    const {  user_id } = req.query;

    try {
        
        if ( !user_id) {
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
                Loadart."trucks" pt
            ON 
                bl."trucks_id" = pt."truck_id"
            JOIN 
                Loadart."loads" l
            ON 
                bl.load_id = l.loads_id
            WHERE 
               bl.user_id = $1;
        `;

        
        const result = await pool.query(query, [ user_id]);

        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found for the given  user_id." });
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

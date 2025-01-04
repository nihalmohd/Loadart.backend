import pool from "../Model/Config.js";

export const getBidsLoadWithDetails = async (req, res) => {
    const { load_id } = req.query;

    try {
        
        if (!load_id) {
            return res.status(400).json({ message: "load_id is required." });
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
                bl.load_id = $1;
        `;

      
        const result = await pool.query(query, [load_id]);

        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No data found for the given load_id." });
        }

        res.status(200).json({
            message: "Data retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving bidsLoad data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

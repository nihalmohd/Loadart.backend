import pool from "../../Model/Config.js";

export const getBidsLoadWithDetails = async (req, res) => {
    const { load_id } = req.query;

    try {
        
        if (!load_id) {
            return res.status(400).json({ message: "load_id is required." });
        }

        
        const query = `
            SELECT 
                bt.*,
                u.*, 
                t.*, 
                l.*
            FROM 
                Loadart."bidsTruck" bt
            JOIN 
                Loadart."users" u
            ON 
                bt.user_id = u.users_id
            JOIN 
                Loadart."trucks" t
            ON 
                bt."trucks_id" = t."truck_id"
            JOIN 
                Loadart."loads" l
            ON 
                bt.loads_id = l.loads_id
            WHERE 
                bt.loads_id = $1
            AND 
                bt."bidsTruck_status"::INTEGER != 3;
        `;

      
        const result = await pool.query(query, [load_id]);

        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found." });
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

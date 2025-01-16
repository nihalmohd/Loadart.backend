import pool from "../../Model/Config.js";

export const getBidsByUserAndLoad = async (req, res) => {
    const { user_id, load_id } = req.body;

    try {
        // Validate input
        if (!user_id || !load_id) {
            return res.status(400).json({ message: "Both user_id and load_id are required." });
        }

        // SQL query to fetch matching data
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
                bl.user_id = $1 AND bl.load_id = $2;
        `;

        // Execute the query
        const result = await pool.query(query, [user_id, load_id]);

        // Check if data is found
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No data found for the given user_id and load_id." });
        }

        // Respond with the retrieved data
        return res.status(200).json({
            message: "Data retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving bidsLoad data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

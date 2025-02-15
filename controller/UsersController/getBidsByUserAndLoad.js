import pool from "../../Model/Config.js";

export const getBidsByUserAndLoad = async (req, res) => {
    const { user_id, load_id } = req.query;

    try {
        // Validate input
        if (!user_id || !load_id) {
            return res.status(400).json({ message: "Both user_id and load_id are required." });
        }

        // SQL query to fetch matching data
        const query = `
        SELECT 
            bt.*, 
            u.*,  
            t.*, 
            l.*, 
            tt.*, 
            m.*,  
            tc.*  
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
        JOIN 
            Loadart."truck_types" tt 
        ON 
            t."trucks_type_id" = tt."truck_types_id"
        JOIN 
            Loadart."materials" m  
        ON 
            l."material_id" = m."materials_id"  
        JOIN 
            Loadart."truck_capacities" tc  
        ON 
            t."capacity_id" = tc."truck_capacities_id" 
        WHERE 
            bt.user_id = $1 
        AND 
            bt.loads_id = $2;
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

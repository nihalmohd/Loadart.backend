import pool from "../../Model/Config.js";

export const getBidsByUserAndLoad = async (req, res) => {
    const { user_id, load_id } = req.query;

    try {
        // Validate input
        if (!user_id || !load_id) {
            return res.status(400).json({ message: "Both user_id and load_id are required." });
        }

        const query = `
        SELECT 
             bl."bidsLoad_id", 
            bl."bidsLoad_amount", 
            bl."bidsLoad_status", 
            u.users_name, 
            u.users_id, 
            t.truck_id,  
            t."regNumber",  
            t.user_id AS user_id,
            l.loads_id, 
            l."pickupLoc",
            l."deliveryLoc",
            l."pickupDate", 
            tt.truck_types_name, 
            m.materials_id,
            m.materials_name, 
            tc.truck_capacities_name
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
        LEFT JOIN 
            Loadart."truck_types" tt 
        ON 
            t."trucks_type_id" = tt."truck_types_id"
        LEFT JOIN 
            Loadart."materials" m  
        ON 
            l."material_id" = m."materials_id"  
        JOIN 
            Loadart."truck_capacities" tc  
        ON 
            t."capacity_id" = tc."truck_capacities_id" 
        WHERE 
            bl.user_id = $1 
        AND 
            bl.load_id = $2
        ORDER BY 
            bl."bidsLoad_id" DESC;  -- Sorting by bidsLoad_id in descending order
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

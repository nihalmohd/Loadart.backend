import pool from "../../Model/Config.js";

export const getTruckBidsWithDetails = async (req, res) => {
    const { trucks_id ,user_id } = req.query;

    try {
        
        if (!trucks_id || !user_id) {
            return res.status(400).json({ message: "trucks_id,user_id is required." });
        }

        
        const query = `
        SELECT 
            bl.*, 
            u.*, 
            t.*, 
            l.*, 
            tt.*, 
            m.*,  
            tc.*,  
            pt.*  
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
        JOIN 
            Loadart."postTrucks" pt  
        ON 
            t."truck_id" = pt."truck_id"  
        WHERE 
            bl."trucks_id" = $1
        AND 
            bl."bidsLoad_status"::INTEGER != 4 
        AND 
            bl.user_id != $2
        ORDER BY 
            bl."bidsLoad_id" DESC;  -- Sorting by bidsLoad_id in descending order
    `;
    

       
        const result = await pool.query(query, [trucks_id,user_id]);

        
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

import pool from "../../Model/Config.js";

export const getAllLoads = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 20; 
    const offset = (page - 1) * limit; 

    const fetchLoadsQuery = `
    SELECT 
        l.*, 
        m.*, 
        tc.*, 
        tt.*, 
        u.*, 
        ut.*
    FROM 
        Loadart."loads" l
    JOIN 
        Loadart."materials" m
    ON 
        l.material_id = m.materials_id
    JOIN 
        Loadart."truck_capacities" tc
    ON 
        l.capacity_id = tc.truck_capacities_id
    JOIN 
        Loadart."truck_types" tt
    ON 
        l.truck_type_id = tt.truck_types_id
    JOIN 
        Loadart."users" u
    ON 
        l.user_id = u.users_id
    JOIN 
        Loadart."user_types" ut
    ON 
        u.user_types_id = ut.user_types_id
    WHERE 
        l.loads_status != $1
    ORDER BY 
        l.loads_id DESC  -- Sorting loads in descending order
    LIMIT 
        $2 OFFSET $3;
`;


    try {
        const result = await pool.query(fetchLoadsQuery, [3,limit, offset]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No loads found for the specified page." });
        }

        res.status(200).json({
            message: "Loads retrieved successfully.",
            currentPage: page,
            pageSize: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving paginated loads:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

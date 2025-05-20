import pool from "../../Model/Config.js";

export const getPaginatedTrucks = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 20; 
    const offset = (page - 1) * limit; 
    const fetchTrucksQuery = `
    SELECT 
        t.*, 
        tmf.*, 
        tmd.*, 
        tc.*, 
        tt.*, 
        u.*, 
        ut.*, 
        pt.*
    FROM 
        Loadart."trucks" t
    JOIN 
        Loadart."truck_manufacturers" tmf
    ON 
        t.manufacturer_id = tmf.truck_manufacturers_id
    JOIN 
        Loadart."truck_models" tmd
    ON 
        t.model_id = tmd.truck_models_id
    JOIN 
        Loadart."truck_capacities" tc
    ON 
        t.capacity_id = tc.truck_capacities_id
    JOIN 
        Loadart."truck_types" tt
    ON 
        t.trucks_type_id = tt.truck_types_id
    JOIN 
        Loadart."users" u
    ON 
        t.user_id = u.users_id
    JOIN 
        Loadart."user_types" ut
    ON 
        u.user_types_id = ut.user_types_id
    JOIN 
        Loadart."postTrucks" pt
    ON 
        t.truck_id = pt.truck_id
    WHERE 
        t.trucks_status = 5 AND 
        pt."postTrucks_status"::text != '6'
    ORDER BY 
        t.truck_id DESC  -- Sorting trucks in descending order
    LIMIT 
        $1 OFFSET $2;
`;



    try {
        const result = await pool.query(fetchTrucksQuery, [limit, offset]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No trucks found for the specified page." });
        }

        res.status(200).json({
            message: "Trucks retrieved successfully.",
            currentPage: page,
            pageSize: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving paginated trucks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

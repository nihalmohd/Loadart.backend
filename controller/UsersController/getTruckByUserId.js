import pool from "../../Model/Config.js";

export const getTrucksByUserId = async (req, res) => {
    const { user_id, trucks_status } = req.query;
    const limit = 20;

    if (!user_id) {
        return res.status(400).json({ message: "user_id is required in query parameters." });
    }

let fetchTrucksQuery = `
    SELECT 
        t.truck_id,  -- Ensure truck_id always comes from trucks table
        t.trucks_type_id,
        t.capacity_id,
        t."regNumber",
        t.trucks_status,
        t.location,
        t.user_id,
        tc.truck_capacities_id,
        tc.truck_capacities_name,
        tt.truck_types_id,
        tt.truck_types_name,
        pt."postTrucks_id",   -- These may be NULL
        pt."postTrucks_from",
        pt."postTrucks_to",
        pt."postTrucks_status"
    FROM 
        Loadart."trucks" t
    JOIN 
        Loadart."truck_capacities" tc ON t.capacity_id = tc.truck_capacities_id
    JOIN 
        Loadart."truck_types" tt ON t.trucks_type_id = tt.truck_types_id
    LEFT JOIN 
        Loadart."postTrucks" pt ON t.truck_id = pt.truck_id
    WHERE 
        t."user_id" = $1
        AND t."truck_id" IS NOT NULL  -- Ensure truck_id is always valid
    ORDER BY 
        t."truck_id" DESC;  -- Fetch data in descending order based on truck_id
`;


    const queryParams = [user_id];

    if (trucks_status) {
        fetchTrucksQuery += ` AND t."trucks_status" = $2`;
        queryParams.push(trucks_status);
    }

    fetchTrucksQuery += ` LIMIT $${queryParams.length + 1};`;
    queryParams.push(limit);

    try {
        const result = await pool.query(fetchTrucksQuery, queryParams);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No trucks found for the given criteria." });
        }

        res.status(200).json({
            message: "Trucks retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving trucks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../../Model/Config.js";

export const getTrucksByUserId = async (req, res) => {
    const { user_id, trucks_status } = req.query;
    const limit = 20;

    if (!user_id) {
        return res.status(400).json({ message: "user_id is required in query parameters." });
    }

    let fetchTrucksQuery = `
    SELECT 
        t.*, 
        tc.*, 
        tt.*,
        pt.*
    FROM 
        Loadart."trucks" t
    JOIN 
        Loadart."truck_capacities" tc ON t.capacity_id = tc.truck_capacities_id
    JOIN 
        Loadart."truck_types" tt ON t.trucks_type_id = tt.truck_types_id
    JOIN
        Loadart."postTrucks" pt ON t.truck_id = pt.truck_id    
    WHERE 
        t."user_id" = $1  
`;

    const queryParams = [user_id];

    if (trucks_status) {
        fetchTrucksQuery += ` AND "trucks_status" = $2`;
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

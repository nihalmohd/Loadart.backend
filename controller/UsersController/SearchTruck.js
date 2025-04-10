import pool from "../../Model/Config.js";

export const getMatchingPostTrucks = async (req, res) => {
    const {
        postTrucks_dateTime,
        postTrucks_from,
        postTrucks_to,
        postTrucks_capacity_id,
        truck_type_id,
        user_id, 
        limit,
        offset
    } = req.body;

    console.log("Received body:", req.body);

    // Default pagination values
    const itemsPerPage = limit || 10;
    const currentOffset = offset || 0;

    let query = `
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
    LEFT JOIN 
        Loadart."truck_manufacturers" tmf ON t.manufacturer_id = tmf.truck_manufacturers_id
    LEFT JOIN 
        Loadart."truck_models" tmd ON t.model_id = tmd.truck_models_id
    LEFT JOIN 
        Loadart."truck_capacities" tc ON t.capacity_id = tc.truck_capacities_id
    LEFT JOIN 
        Loadart."truck_types" tt ON t.trucks_type_id = tt.truck_types_id
    LEFT JOIN 
        Loadart."users" u ON t.user_id = u.users_id
    LEFT JOIN 
        Loadart."user_types" ut ON u.user_types_id = ut.user_types_id
    LEFT JOIN 
        Loadart."postTrucks" pt ON t.truck_id = pt.truck_id
    WHERE 
        t.trucks_status = 5 
        AND t.user_id != $1
        AND (pt."postTrucks_status" IS NULL OR pt."postTrucks_status"::INTEGER NOT IN (6, 7))
    `;

    const values = [user_id];
    let paramIndex = 2;

    if (postTrucks_dateTime) {
        query += ` AND pt."postTrucks_dateTime" >= $${paramIndex++}`;
        values.push(postTrucks_dateTime);
    }

    if (postTrucks_from) {
        query += ` AND pt."postTrucks_from" ILIKE $${paramIndex++}`;
        values.push(`%${postTrucks_from}%`);
    }

    if (postTrucks_to) {
        query += ` AND pt."postTrucks_to" ILIKE $${paramIndex++}`;
        values.push(`%${postTrucks_to}%`);
    }

    if (postTrucks_capacity_id) {
        query += ` AND pt."postTrucks_capacity_id" = $${paramIndex++}`;
        values.push(postTrucks_capacity_id);
    }

    if (truck_type_id) {
        query += ` AND t.trucks_type_id = $${paramIndex++}`;
        values.push(truck_type_id);
    }

    // Order by postTruck_id DESC and apply pagination
    query += ` ORDER BY pt."postTrucks_id" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(itemsPerPage, currentOffset);

    console.log("Final Query:", query);
    console.log("Query Values:", values);

    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, values);

        console.log("Query Result:", result.rows);

        if (result.rows.length > 0) {
            res.status(200).json({ data: result.rows });
        } else {
            res.status(200).json({ message: "No matching post trucks found." });
        }
    } catch (error) {
        console.error("Error retrieving matching postTrucks:", error);
        res.status(500).json({ message: "Failed to fetch matching post trucks." });
    } finally {
        if (client) client.release();
    }
};

import pool from "../../Model/Config.js";

export const getMatchingPostTrucks = async (req, res) => {
    const {
        postTrucks_dateTime,
        postTrucks_from,
        postTrucks_to,
        postTrucks_capacity_id,
        truck_type_id,
        no_of_trucks,
        offset
    } = req.body;

    try {
        const query = `
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
                pt."postTrucks_status"::text != '6' AND
                ($1::timestamp IS NULL OR pt."postTrucks_dateTime" = $1) AND
                ($2::text IS NULL OR pt."postTrucks_from" = $2) AND
                ($3::text IS NULL OR pt."postTrucks_to" = $3) AND
                ($4::integer IS NULL OR pt."postTrucks_capacity_id" = $4) AND
                ($5::integer IS NULL OR t.trucks_type_id = $5)
            LIMIT 
                $6 OFFSET $7;
        `;

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const itemsPerPage = no_of_trucks || 12; // Default limit is 12
        const currentOffset = offset || (page - 1) * itemsPerPage;

        const values = [
            postTrucks_dateTime || null,
            postTrucks_from || null,
            postTrucks_to || null,
            postTrucks_capacity_id || null,
            truck_type_id || null,
            itemsPerPage,
            currentOffset   
        ];

        // Execute the query
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.status(200).json({ data: result.rows });
        } else {
            res.status(200).json({ message: "No matching post trucks found." });
        }
    } catch (error) {
        console.error("Error retrieving matching postTrucks:", error);
        res.status(500).json({ message: "Failed to fetch matching post trucks." });
    }
}; 

import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const getMatchingPostTrucks = async (req, res) => {
    const {
        postTrucks_dateTime,
        postTrucks_from,
        postTrucks_to,
        postTrucks_capacity_id,
        truck_type_id,
        user_id,
        limit,
        offset,
        lang = "en"
    } = req.body;

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

    query += ` ORDER BY pt."postTrucks_id" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(itemsPerPage, currentOffset);

    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, values);
        let translatedData = result.rows;

        if (lang !== "en" && result.rows.length > 0) {
            translatedData = await Promise.all(result.rows.map(async (row) => {
                return {
                    ...row,
                    truck_capacities_name: row.truck_capacities_name ? await translateText(row.truck_capacities_name, lang) : null,
                    truck_types_name: row.truck_types_name ? await translateText(row.truck_types_name, lang) : null,
                    user_types_name: row.user_types_name ? await translateText(row.user_types_name, lang) : null,
                    postTrucks_from: row.postTrucks_from ? await translateText(row.postTrucks_from, lang) : null,
                    postTrucks_to: row.postTrucks_to ? await translateText(row.postTrucks_to, lang) : null,
                    comments: row.comments ? await translateText(row.comments, lang) : null
                };
            }));
        }

        res.status(200).json({
            message: translatedData.length > 0 ? "Data retrieved successfully." : "No matching post trucks found.",
            data: translatedData
        });

    } catch (error) {
        console.error("Error retrieving matching postTrucks:", error);
        res.status(500).json({ message: "Failed to fetch matching post trucks." });
    } finally {
        if (client) client.release();
    }
};

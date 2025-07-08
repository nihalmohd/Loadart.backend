import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";


export const getTrucksByUserId = async (req, res) => {
    const { user_id, trucks_status, lang = "en" } = req.query;
    const limit = 20;

    if (!user_id) {
        return res.status(400).json({ message: "user_id is required in query parameters." });
    }

    let fetchTrucksQuery = `
        SELECT 
            t.truck_id,
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
            pt."postTrucks_id",
            pt."postTrucks_from",
            pt."postTrucks_to",
            pt."postTrucks_status"
        FROM 
            Loadart."trucks" t
        JOIN 
            Loadart."truck_capacities" tc ON t.capacity_id = tc.truck_capacities_id
        LEFT JOIN 
            Loadart."truck_types" tt ON t.trucks_type_id = tt.truck_types_id
        LEFT JOIN 
            Loadart."postTrucks" pt ON t.truck_id = pt.truck_id
        WHERE 
            t."user_id" = $1
    `;

    const queryParams = [user_id];

    if (trucks_status) {
        fetchTrucksQuery += ` AND t."trucks_status" = $${queryParams.length + 1}`;
        queryParams.push(trucks_status);
    }

    fetchTrucksQuery += ` ORDER BY t."truck_id" DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);

    try {
        const result = await pool.query(fetchTrucksQuery, queryParams);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No trucks found for the given criteria." });
        }

        let translatedData = result.rows;

        // Apply translation only if target language is not English
        if (lang !== "en") {
            translatedData = await Promise.all(result.rows.map(async (row) => {
                return {
                    ...row,
                    truck_capacities_name: row.truck_capacities_name
                        ? await translateText(row.truck_capacities_name, lang)
                        : null,
                    truck_types_name: row.truck_types_name
                        ? await translateText(row.truck_types_name, lang)
                        : null,
                    postTrucks_from: row.postTrucks_from
                        ? await translateText(row.postTrucks_from, lang)
                        : null,
                    postTrucks_to: row.postTrucks_to
                        ? await translateText(row.postTrucks_to, lang)
                        : null,
                };
            }));
        }

        res.status(200).json({
            message: "Trucks retrieved successfully.",
            data: translatedData,
        });
    } catch (error) {
        console.error("Error retrieving trucks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

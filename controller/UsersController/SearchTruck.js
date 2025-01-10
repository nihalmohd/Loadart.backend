import pool from "../../Model/Config.js";

export const getMatchingPostTrucks = async (req, res) => {
    const {
        postTrucks_dateTime,
        postTrucks_from,
        postTrucks_to,
        postTrucks_capacity_id,
    } = req.body;

    try {
        const query = `
        SELECT 
            pt.*, 
            t.*  
        FROM 
            loadart."postTrucks" pt
        LEFT JOIN 
            loadart."trucks" t
        ON 
            pt."truck_id" = t."truck_id"
        WHERE 
            ($1::timestamp IS NULL OR pt."postTrucks_dateTime" = $1) AND
            ($2::text IS NULL OR pt."postTrucks_from" = $2) AND
            ($3::text IS NULL OR pt."postTrucks_to" = $3) AND
            ($4::integer IS NULL OR pt."postTrucks_capacity_id" = $4);
    `;
    
        const values = [
            postTrucks_dateTime || null,
            postTrucks_from || null,
            postTrucks_to || null,
            postTrucks_capacity_id || null,
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No matching postTrucks found." });
        }

        res.status(200).json({
            message: "Matching postTrucks retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving matching postTrucks:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

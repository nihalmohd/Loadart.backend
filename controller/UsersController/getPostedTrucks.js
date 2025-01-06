import pool from "../../Model/Config.js";

export const getPostTrucks = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT 
                pt.*, 
                t.*
            FROM 
                loadart."postTrucks" pt
            JOIN 
                loadart."trucks" t
            ON 
                pt.truck_id = t.truck_id
            LIMIT $1 OFFSET $2;
        `;

        const result = await pool.query(query, [limit, offset]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No postTrucks data found." });
        }

        res.status(200).json({
            message: "postTrucks data retrieved successfully.",
            currentPage: page,
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving postTrucks data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

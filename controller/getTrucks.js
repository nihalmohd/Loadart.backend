import pool from "../Model/Config.js";

export const getPaginatedTrucks = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 20; 
    const offset = (page - 1) * limit; 

    const fetchTrucksQuery = `
        SELECT *
        FROM loadart.trucks
        LIMIT $1 OFFSET $2;
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

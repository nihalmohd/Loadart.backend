import pool from "../Model/Config.js";

export const getLoadsByUserId = async (req, res) => {
    const { user_id } = req.params;

  
    if (!user_id) {
        return res.status(400).json({ message: "User ID is required." });
    }


    const fetchLoadsQuery = `
        SELECT *
        FROM loadart.loads
        WHERE "user_id" = $1;
    `;

    try {

        const result = await pool.query(fetchLoadsQuery, [user_id]);


        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No loads found for the given user ID." });
        }

        res.status(200).json({
            message: "Loads retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving loads:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

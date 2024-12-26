import pool from "../Model/Config.js";

export const getAllLoads = async (req, res) => {
    const fetchLoadsQuery = `
        SELECT *
        FROM loadart.loads;
    `;

    try {
        const result = await pool.query(fetchLoadsQuery);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No loads found." });
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

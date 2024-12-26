import pool from "../Model/Config.js";

export const getAllStates = async (req, res) => {
    const fetchStatesQuery = `
        SELECT *
        FROM loadart.states;
    `;

    try {
        const result = await pool.query(fetchStatesQuery);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No states found in the table." });
        }

        res.status(200).json({
            message: "States retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving states:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

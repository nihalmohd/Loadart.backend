import pool from "../../Model/Config.js";

export const getDistrictsByStateId = async (req, res) => {
    const { states_id } = req.query; 

 
    if (!states_id) {
        return res.status(400).json({ message: "State ID is required." });
    }

    const fetchDistrictsQuery = `
        SELECT *
        FROM loadart.districts
        WHERE "states_id" = $1;
    `;

    try {
        const result = await pool.query(fetchDistrictsQuery, [states_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No districts found for the given state ID." });
        }

        res.status(200).json({
            message: "Districts retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving districts:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}; 

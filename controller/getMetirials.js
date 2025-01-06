import pool from "../Model/Config.js";

export const getAllMaterials = async (req, res) => {
    const fetchMaterialsQuery = `
        SELECT *
        FROM loadart.materials;
    `;

    try {
        const result = await pool.query(fetchMaterialsQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No materials found." });
        }

        res.status(200).json({
            message: "Materials retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving materials:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
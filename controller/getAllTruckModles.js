import pool from "../Model/Config.js"; 

export const getAllTruckModels = async (req, res) => {
    const fetchTruckModelsQuery = `
        SELECT *
        FROM loadart.truck_models; 
    `;

    try {
        const result = await pool.query(fetchTruckModelsQuery);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No truck models found." });
        }

        res.status(200).json({
            message: "Truck models retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving truck models:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../Model/Config.js"; 

export const getAllTruckTypes = async (req, res) => {
    const fetchTruckTypesQuery = `
        SELECT *
        FROM loadart.truck_types;  
    `;

    try {
        const result = await pool.query(fetchTruckTypesQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No truck types found." });
        }

        res.status(200).json({
            message: "Truck types retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving truck types:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../Model/Config.js"; 

export const getAllTruckCapacities = async (req, res) => {
    const fetchTruckCapacitiesQuery = `
        SELECT *
        FROM loadart.truck_capacities;  
    `;

    try {
        const result = await pool.query(fetchTruckCapacitiesQuery);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No truck capacities found." });
        }

        res.status(200).json({
            message: "Truck capacities retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving truck capacities:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

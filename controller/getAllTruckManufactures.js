import pool from "../Model/Config.js"; 

export const getAllTruckManufacturers = async (req, res) => {
    const fetchTruckManufacturersQuery = `
        SELECT *
        FROM loadart.truck_manufacturers; 
    `;

    try {
        const result = await pool.query(fetchTruckManufacturersQuery);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No truck manufacturers found." });
        }

        res.status(200).json({
            message: "Truck manufacturers retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving truck manufacturers:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../Model/Config.js";

export const getMatchingLoads = async (req, res) => {
    const {
        pickupLoc_id,
        deliveryLoc_id,
        pickupDate,
        material_id,
        capacity_id,
        truck_type_id, // Included truck_type_id
    } = req.body;

    try {
        // SQL query to fetch matching loads
        const query = `
            SELECT *
            FROM loadart.loads
            WHERE 
                ($1::text IS NULL OR "pickupLoc_id" = $1) AND
                ($2::text IS NULL OR "deliveryLoc_id" = $2) AND
                ($3::date IS NULL OR "pickupDate" = $3) AND
                ($4::integer IS NULL OR "material_id" = $4) AND
                ($5::integer IS NULL OR "capacity_id" = $5) AND
                ($6::integer IS NULL OR "truck_type_id" = $6); -- Updated truck_type_id
        `;

        // Parameterized values
        const values = [
            pickupLoc_id || null,
            deliveryLoc_id || null,
            pickupDate || null,
            material_id || null,
            capacity_id || null,
            truck_type_id || null,
        ];

        // Execute the query
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No matching loads found." });
        }

        // Send success response
        res.status(200).json({
            message: "Matching loads retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        // Handle errors
        console.error("Error retrieving matching loads:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

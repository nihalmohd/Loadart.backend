import pool from "../../Model/Config.js";

export const getMatchingLoads = async (req, res) => {
    const {
        pickupLoc,
        deliveryLoc,
        pickupDate,
        material_id,
        capacity_id,
        truck_type_id, 
    } = req.body;

    try {
       
        const query = `
            SELECT *
            FROM loadart.loads
            WHERE 
                ($1::text IS NULL OR "pickupLoc" = $1) AND
                ($2::text IS NULL OR "deliveryLoc" = $2) AND
                ($3::date IS NULL OR "pickupDate" = $3) AND
                ($4::integer IS NULL OR "material_id" = $4) AND
                ($5::integer IS NULL OR "capacity_id" = $5) AND
                ($6::integer IS NULL OR "truck_type_id" = $6); -- Updated truck_type_id
        `;

        
        const values = [
            pickupLoc || null,
            deliveryLoc || null,
            pickupDate || null,
            material_id || null,
            capacity_id || null,
            truck_type_id || null,
        ];

        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No matching loads found." });
        }

        
        res.status(200).json({
            message: "Matching loads retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        
        console.error("Error retrieving matching loads:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

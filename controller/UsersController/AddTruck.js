import pool from "../../Model/Config.js"; 

export const insertTruck = async (req, res) => {
    const { regNumber, trucks_type_id, capacity_id, insurance, rc, model_id, manufacturer_id, user_id, location } = req.body;

    
    if (!regNumber || !capacity_id || !insurance || !rc  || !user_id ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const insertTruckQuery = `
    INSERT INTO loadart.trucks 
    ("regNumber", "trucks_type_id", "capacity_id", "insurance", "rc", "user_id", "location")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
`;

    const values = [regNumber, trucks_type_id, capacity_id, insurance, rc, user_id, location];

    try {
        const result = await pool.query(insertTruckQuery, values);

        if (result.rows.length === 0) {
            return res.status(500).json({ message: "Error inserting truck data." });
        }

        res.status(201).json({
            message: "Truck added successfully.",
            data: result.rows[0], 
        });
    } catch (error) {
        console.error("Error inserting truck:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

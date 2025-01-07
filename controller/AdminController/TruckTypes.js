import pool from "../../Model/Config.js";

export const insertTruckType = async (req, res) => {
    try {
        const { truck_types_name } = req.body;

        if (!truck_types_name) {
            return res.status(400).json({
                error: "Missing required field: truck_types_name.",
            });
        }

        const query = `
            INSERT INTO "loadart"."truck_types" ("truck_types_name")
            VALUES ($1)
            RETURNING *;
        `;

        const result = await pool.query(query, [truck_types_name]);

        return res.status(201).json({
            message: "Truck type inserted successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting truck type:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};

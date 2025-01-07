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



export const getAllTruckTypes = async (req, res) => {
    try {
        const query = `
            SELECT * 
            FROM "loadart"."truck_types";
        `;

        const result = await pool.query(query);

        return res.status(200).json({
            message: "Truck types retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving truck types:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};


export const updateTruckTypeName = async (req, res) => {
    try {
        const { truck_types_id, truck_types_name } = req.body;

        if (!truck_types_id || !truck_types_name) {
            return res.status(400).json({
                error: "Both truck_types_id and truck_types_name are required.",
            });
        }

        const query = `
            UPDATE "loadart"."truck_types"
            SET "truck_types_name" = $1
            WHERE "truck_types_id" = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [truck_types_name, truck_types_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Truck type not found with the given ID.",
            });
        }
        return res.status(200).json({
            message: "Truck type name updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating truck type name:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};


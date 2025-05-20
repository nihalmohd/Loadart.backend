import pool from "../../Model/Config.js";

export const insertUserTypes = async (req, res) => {
    try {

        const { user_types_name } = req.body;


        if (!user_types_name) {
            return res.status(400).json({
                error: "Missing required field: user_types_name",
            });
        }

        const query = `
            INSERT INTO "loadart"."user_types" ("user_types_name")
            VALUES ($1)
            RETURNING *;
        `;


        const result = await pool.query(query, [user_types_name]);


        return res.status(201).json({
            message: "User type created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting user type:", error);


        if (error.code === "42703") {
            return res.status(400).json({
                error: "Invalid column name in the query. Please verify your database schema.",
            });
        }

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};



export const editUserType = async (req, res) => {
    try {
        const { user_types_id, user_types_name } = req.body;

        if (!user_types_id || !user_types_name) {
            return res.status(400).json({
                error: "Missing required fields: user_types_id and user_types_name",
            });
        }

        const query = `
            UPDATE "loadart"."user_types"
            SET "user_types_name" = $1
            WHERE "user_types_id" = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [user_types_name, user_types_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "No user type found with the provided user_types_id",
            });
        }

        return res.status(200).json({
            message: "User type updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating user type:", error);

        if (error.code === "42703") {
            return res.status(400).json({
                error: "Invalid column name in the query. Please verify your database schema.",
            });
        }

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};


export const getAllUserTypes = async (req, res) => {
    try {
        const query = `
            SELECT * FROM "loadart"."user_types";
        `;

        const result = await pool.query(query);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No user types found in the table.",
            });
        }

        return res.status(200).json({
            message: "User types retrieved successfully.",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving user types:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};



export const updateUserTypeStatus = async (req, res) => {
    try {
        const { user_types_id, user_types_status } = req.body;

        if (!user_types_id || user_types_status === undefined) {
            return res.status(400).json({
                error: "Missing required fields: user_types_id and user_types_status.",
            });
        }

        const query = `
            UPDATE "loadart"."user_types"
            SET "user_types_status" = $1
            WHERE "user_types_id" = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [user_types_status, user_types_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: `No user type found with user_types_id: ${user_types_id}`,
            });
        }

        return res.status(200).json({
            message: "User type status updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating user type status:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};

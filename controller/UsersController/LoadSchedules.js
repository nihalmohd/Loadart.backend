import pool from "../../Model/Config.js";


export const updateAndInsertSchedules = async (req, res) => {
    const {
        schedules_date,
        pickup_loc,
        delivery_loc,
        materials_id,
        users_id,
        postTrucks_id,
        loads_id,
    } = req.body;

    try {
        
        if (
            !schedules_date ||
            !pickup_loc ||
            !delivery_loc ||
            !materials_id ||
            !users_id ||
            !postTrucks_id ||
            !loads_id
        ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        
        const updateQuery = `
            UPDATE Loadart."bidsLoad"
            SET "bidsLoad_status" = $1
            WHERE "user_id" = $2 AND "load_id" = $3;
        `;
        const updateResult = await pool.query(updateQuery, [3, users_id, loads_id]);

        
        if (updateResult.rowCount === 0) {
            return res
                .status(404)
                .json({ message: "No matching row found in bidsLoad table for update." });
        }

        
        const insertQuery = `
            INSERT INTO Loadart."load_schedules" 
            ("schedules_date", "pickup_loc", "delivery_loc", "materials_id", "users_id", "postTrucks_id", "loads_id")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const insertResult = await pool.query(insertQuery, [
            schedules_date,
            pickup_loc,
            delivery_loc,
            materials_id,
            users_id,
            postTrucks_id,
            loads_id,
        ]);

       
        res.status(201).json({
            message: "Schedule inserted and bidsLoad updated successfully.",
            schedule: insertResult.rows[0],
        });
    } catch (error) {
        console.error("Error updating and inserting schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

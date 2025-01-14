import pool from "../../Model/Config.js";

export const updateBidsTruckAndInsertSchedule = async (req, res) => {
    const { 
        truckSchedules_date, 
        vehicle_reg, 
        pickup_loc, 
        delivery_loc, 
        user_id, 
        postTrucks_id, 
        loads_id 
    } = req.body;

    try {
        // Check if all required fields are provided
        if (
            !truckSchedules_date || 
            !vehicle_reg || 
            !pickup_loc || 
            !delivery_loc || 
            !user_id || 
            !postTrucks_id || 
            !loads_id
        ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Start a database transaction
        await pool.query("BEGIN");

        // Update bidsTruck table
        const updateQuery = `
            UPDATE Loadart."bidsTruck"
            SET "bidsTruck_status" = 3
            WHERE "user_id" = $1 AND "postTrucks_id" = $2;
        `;
        const updateResult = await pool.query(updateQuery, [user_id, postTrucks_id]);

        if (updateResult.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "No matching rows found to update in bidsTruck table." });
        }

        // Insert into truck_schedules table
        const insertQuery = `
            INSERT INTO Loadart."truck_schedules" 
            ("truckSchedules_date", "vehicle_reg", "pickup_loc", "delivery_loc", "user_id", "postTrucks_id", "loads_id")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const insertResult = await pool.query(insertQuery, [
            truckSchedules_date, 
            vehicle_reg, 
            pickup_loc, 
            delivery_loc, 
            user_id, 
            postTrucks_id, 
            loads_id
        ]);

        // Commit the transaction
        await pool.query("COMMIT");

        // Send success response
        res.status(201).json({
            message: "bidsTruck updated and truck_schedules inserted successfully.",
            schedule: insertResult.rows[0],
        });
    } catch (error) {
        // Rollback the transaction on error
        await pool.query("ROLLBACK");
        console.error("Error updating bidsTruck and inserting truck_schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

import pool from "../../Model/Config.js";

export const updateBidsTruckAndInsertSchedule = async (req, res) => {
    const { 
        truckSchedules_date, 
        vehicle_reg, 
        pickup_loc, 
        delivery_loc, 
        user_id, 
        trucks_id, 
        loads_id ,
        users_id,
        materials_id,
        bidsLoad_id

    } = req.body;

    try {
        // Check if all required fields are provided
        if (
            !truckSchedules_date || 
            !vehicle_reg || 
            !pickup_loc || 
            !delivery_loc || 
            !user_id || 
            !trucks_id || 
            !loads_id ||
            !users_id|| !bidsLoad_id
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Start a database transaction
        await pool.query("BEGIN");

        // Update bidsTruck table
        const updateQuery = `
            UPDATE Loadart."bidsLoad"
            SET "bidsLoad_status" = 3
            WHERE "bidsLoad_id"=$1;
        `;
        const updateResult = await pool.query(updateQuery, [bidsLoad_id]);

        if (updateResult.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "No matching rows found to update in bidsLoad table" });
        }

        const updateQuery2 = `
            UPDATE Loadart."loads"
            SET "loads_status" = 3
            WHERE "loads_id"=$1;
        `;
        const updateResult2 = await pool.query(updateQuery2, [loads_id]);

        if (updateResult2.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "No matching rows found to update in loads table" });
        }
        
        
        // const updateTruckQuery = `
        //     UPDATE Loadart."bidsTruck"
        //     SET "bidsTruck_status" = $1
        //     WHERE "user_id" = $2 AND "loads_id" = $3;
        // `;
        // const updateTruckResult = await pool.query(updateTruckQuery, [3, user_id, loads_id]);
        
        // if (updateTruckResult.rowCount === 0) {
        //     return res
        //         .status(404)
        //         .json({ message: "No matching row found in bidsTruck table for update." });
        // }
         

        // Insert into truck_schedules table
        const insertQuery = `
            INSERT INTO Loadart."truck_schedules" 
            ("truckSchedules_date", "vehicle_reg", "pickup_loc", "delivery_loc", "user_id", "trucks_id", "loads_id")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const insertResult = await pool.query(insertQuery, [
            truckSchedules_date, 
            vehicle_reg, 
            pickup_loc, 
            delivery_loc, 
            users_id,
            trucks_id, 
            loads_id
        ]);
        const insertLoadQuery = `
        INSERT INTO Loadart."load_schedules" 
        ("schedules_date", "pickup_loc", "delivery_loc", "materials_id", "users_id", "truck_id", "loads_id")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const insertLoadResult = await pool.query(insertLoadQuery, [ 
        truckSchedules_date,
        pickup_loc,
        delivery_loc,
        materials_id,
        user_id,
        trucks_id,
        loads_id,
    ]);

        // Commit the transaction
        await pool.query("COMMIT");

        // Send success response
        res.status(201).json({
            message: "bidsTruck updated and truck_schedules inserted successfully.",
            schedule: insertResult.rows[0],
            LoadSchedules:insertLoadResult.rows[0]
        });
    } catch (error) {
        // Rollback the transaction on error
        await pool.query("ROLLBACK");
        console.error("Error updating bidsTruck and inserting truck_schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

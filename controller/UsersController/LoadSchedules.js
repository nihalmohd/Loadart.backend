import pool from "../../Model/Config.js";
import { translateToEnglish } from "../../Utils/Translate.js";


export const updateAndInsertSchedules = async (req, res) => {
    const {
        schedules_date,
        pickup_loc,
        delivery_loc,
        materials_id,
        user_id,
        users_id,
        truck_id,
        loads_id,
        vehicle_reg,
    } = req.body;

    try {
        // Validate required fields
        if (
            !schedules_date ||
            !pickup_loc ||
            !delivery_loc ||
            !user_id ||
            !users_id ||
            !truck_id ||
            !loads_id
        ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Translate pickup & delivery locations to English
        const translatedPickup = await translateToEnglish(pickup_loc);
        const translatedDelivery = await translateToEnglish(delivery_loc);

        // Update bidsTruck status to 3
        const updateQuery = `
            UPDATE Loadart."bidsTruck"
            SET "bidsTruck_status" = $1
            WHERE "user_id" = $2 AND "loads_id" = $3;
        `;
        const updateResult = await pool.query(updateQuery, [3, users_id, loads_id]);
        if (updateResult.rowCount === 0) {
            return res.status(404).json({ message: "No matching row found in bidsTruck table for update." });
        }

        // Update loads status to 3
        const updateStatusQuery = `
            UPDATE Loadart."loads"
            SET "loads_status" = $1
            WHERE "loads_id" = $2;
        `;
        const updateStatusResult = await pool.query(updateStatusQuery, [3, loads_id]);
        if (updateStatusResult.rowCount === 0) {
            return res.status(404).json({ message: "No matching row found in loads table for update." });
        }

        // Insert into load_schedules
        const insertQuery = `
            INSERT INTO Loadart."load_schedules" 
            ("schedules_date", "pickup_loc", "delivery_loc", "materials_id", "users_id", "truck_id", "loads_id")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const insertResult = await pool.query(insertQuery, [
            schedules_date,
            translatedPickup,
            translatedDelivery,
            materials_id,
            user_id,
            truck_id,
            loads_id,
        ]);

        // Insert into truck_schedules
        const insertTruckQuery = `
            INSERT INTO Loadart."truck_schedules" 
            ("truckSchedules_date", "vehicle_reg", "pickup_loc", "delivery_loc", "user_id", "trucks_id", "loads_id")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const insertTruckResult = await pool.query(insertTruckQuery, [
            schedules_date,
            vehicle_reg,
            translatedPickup,
            translatedDelivery,
            users_id,
            truck_id,
            loads_id,
        ]);

        res.status(201).json({
            message: "Schedule inserted and bidsLoad updated successfully.",
            schedule: insertResult.rows[0],
            TruckSchedule: insertTruckResult.rows[0]
        });

    } catch (error) {
        console.error("Error updating and inserting schedules:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

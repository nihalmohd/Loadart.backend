import pool from "../../Model/Config.js";

// Function to update lorry_receipt in both load_schedules and truck_schedules
export const updateLorryReceipt = async (req, res) => {
    const { schedules_id, lorry_receipt, trucks_id } = req.body;

    if (!schedules_id || !lorry_receipt || !trucks_id) {
        return res.status(400).json({ message: "schedules_id, lorry_receipt, and trucks_id are required." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Update in load_schedules
        const loadSchedulesQuery = `
            UPDATE Loadart."load_schedules" 
            SET 
                "lorry_receipt" = $1,
                "schedules_status" = 8
            WHERE "schedules_id" = $2
            RETURNING *;
        `;
        const loadResult = await client.query(loadSchedulesQuery, [lorry_receipt, schedules_id]);

        if (loadResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "No record found with the given schedules_id." });
        }

        // Update in truck_schedules if truckSchedules_status is '1', also set truckSchedules_status to 8
        const truckSchedulesQuery = `
            UPDATE Loadart."truck_schedules" 
            SET 
                "lorry-receipt" = $1,
                "truckSchedules_status" = '8'
            WHERE "trucks_id" = $2 AND "truckSchedules_status" = '1'
            RETURNING *;
        `;
        const truckResult = await client.query(truckSchedulesQuery, [lorry_receipt, trucks_id]);

        if (truckResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "No record found with the given trucks_id." });
        }


        await client.query("COMMIT");

        res.status(200).json({
            message: "Lorry receipt updated successfully.",
            load_schedules: loadResult.rows[0],
            truck_schedules: truckResult.rows.length > 0 ? truckResult.rows[0] : "No matching truck schedule found.",
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating lorry receipt:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        client.release();
    }
};



export const updateProofOfDelivery = async (req, res) => {
    const { schedules_id, proof_of_delivery, trucks_id } = req.body;

    if (!schedules_id || !proof_of_delivery || !trucks_id) {
        return res.status(400).json({ message: "schedules_id, proof_of_delivery, and trucks_id are required." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Update load_schedules only if schedules_status = 8
        const loadSchedulesQuery = `
            UPDATE Loadart."load_schedules" 
            SET 
                "proof_of_delivery" = $1,
                "schedules_status" = 9
            WHERE "schedules_id" = $2 AND "schedules_status"::INTEGER = 8
            RETURNING *;
        `;
        const loadResult = await client.query(loadSchedulesQuery, [proof_of_delivery, schedules_id]);

        if (loadResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "No record found with the given schedules_id or status is not 8." });
        }

        // Update truck_schedules only if truckSchedules_status = 8, also set it to 9
        const truckSchedulesQuery = `
            UPDATE Loadart."truck_schedules" 
            SET 
                "proof_of_delivery" = $1,
                "truckSchedules_status" = 9
            WHERE "trucks_id" = $2 AND "truckSchedules_status"::INTEGER = 8
            RETURNING *;
        `;
        const truckResult = await client.query(truckSchedulesQuery, [proof_of_delivery, trucks_id]);

        if (truckResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "No matching truck schedule found or status is not 8." });
        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Proof of delivery updated successfully, status set to 9.",
            load_schedules: loadResult.rows[0],
            truck_schedules: truckResult.rows[0],
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating proof of delivery:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        client.release();
    }
};

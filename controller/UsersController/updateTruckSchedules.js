import pool from "../../Model/Config.js";

// Function to update lorry_receipt and set status to 8
export const updateLorryReceiptTruckSchedules = async (req, res) => {
    const { schedules_id, lorry_receipt } = req.body;

    if (!schedules_id || !lorry_receipt) {
        return res.status(400).json({ message: "schedules_id and lorry_receipt are required." });
    }

    const query = `
        UPDATE Loadart."load_schedules" 
        SET 
            "lorry_receipt" = $1,
            "schedules_status" = '8'
        WHERE "schedules_id" = $2
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [lorry_receipt, schedules_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No record found with the given schedules_id." });
        }

        res.status(200).json({
            message: "Lorry receipt updated successfully, status set to 8.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating lorry receipt:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Function to update proof_of_delivery and set status to 9
export const updateProofOfDeliveryTruckSchedules = async (req, res) => {
    const { schedules_id, proof_of_delivery } = req.body;

    if (!schedules_id || !proof_of_delivery) {
        return res.status(400).json({ message: "schedules_id and proof_of_delivery are required." });
    }

    const query = `
        UPDATE Loadart."load_schedules" 
        SET 
            "proof_of_delivery" = $1,
            "schedules_status" = '9'
        WHERE "schedules_id" = $2
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [proof_of_delivery, schedules_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No record found with the given schedules_id." });
        }

        res.status(200).json({
            message: "Proof of delivery updated successfully, status set to 9.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating proof of delivery:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

import pool from "../../Model/Config.js";

export const updateTruckSchedule = async (req, res) => {
    const { truckSchedules_id, lorry_receipt, proof_of_delivery } = req.body;

    // Validate required fields
    if (!truckSchedules_id) {
        return res.status(400).json({ message: "truckSchedules_id is required." });
    }

    // Construct the update query
    let query = `
        UPDATE Loadart."truck_schedules" 
        SET 
            "lorry-receipt" = $1, 
            "proof_of_delivery" = $2
        WHERE 
            "truckSchedules_id" = $3
        RETURNING *;
    `;
    
    // Prepare the values, allowing for NULL if values are not provided
    const values = [
        lorry_receipt || null,
        proof_of_delivery || null,
        truckSchedules_id,
    ];

    try {
        // Execute the query
        const result = await pool.query(query, values);

        // Check if any row was updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No record found with the given truckSchedules_id." });
        }

        res.status(200).json({
            message: "Truck schedule updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating truck schedule:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

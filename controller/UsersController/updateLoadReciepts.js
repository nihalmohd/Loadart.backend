import pool from "../../Model/Config.js";

export const updateLoadSchedule = async (req, res) => {
    const { schedules_id, lorry_receipt, proof_of_delivery } = req.body;

    // Validate required fields
    if (!schedules_id) {
        return res.status(400).json({ message: "schedules_id is required." });
    }

    // Construct the update query
    let query = `
        UPDATE Loadart."load_schedules" 
        SET 
            "lorry_receipt" = $1, 
            "proof_of_delivery" = $2
        WHERE 
            "schedules_id" = $3
        RETURNING *;
    `;
    
    // Prepare the values, allowing for NULL if values are not provided
    const values = [
        lorry_receipt || null,
        proof_of_delivery || null,
        schedules_id,
    ];

    try {
        // Execute the query
        const result = await pool.query(query, values);

        // Check if any row was updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No record found with the given schedules_id." });
        }

        res.status(200).json({
            message: "Load schedule updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating load schedule:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

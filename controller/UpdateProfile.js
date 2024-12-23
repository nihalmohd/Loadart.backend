import pool from "../Model/Config.js";


export const updateTransporterBasicDetails = async (req, res) => {
    const { addressline1, addressline2, state_id, district_id, transporter_id } = req.body;

 
    const updateQuery = `
        UPDATE loadart.transporters
        SET 
            address1 = $1,
            address2 = $2,
            state_id = $3,
            district_id = $4
        WHERE 
            transporters_id = $5 -- Assuming "id" is the primary key for transporters
        RETURNING *; -- Return the updated row
    `;

    const updateValues = [addressline1, addressline2, state_id, district_id, transporter_id];

    try {
        const result = await pool.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Transporter not found or no changes made." });
        }

        res.status(200).json({ message: "Transporter updated successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating transporter:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
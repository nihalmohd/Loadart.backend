import pool from "../../Model/Config.js";

export const updateDriverBasicDetails = async (req, res) => {
    const { addressline1, addressline2, state_id, district_id, drivers_id, licenseNo } = req.body;

    const updateQuery = `
        UPDATE loadart.drivers
        SET 
            address1 = $1,
            address2 = $2,
            states_id = $3,
            districts_id = $4,
            "licenseNo" = $5 
        WHERE 
            drivers_id = $6 
        RETURNING *; 
    `;

    const updateValues = [addressline1, addressline2, state_id, district_id, licenseNo, drivers_id];

    try {
        const result = await pool.query(updateQuery, updateValues);
        console.log(result);
        

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Driver not found or no changes made." });
        }

        res.status(200).json({
            message: "Driver updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating Driver:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
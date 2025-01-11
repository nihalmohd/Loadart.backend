import pool from "../../Model/Config.js";

export const updateShipperBasicDetails = async (req, res) => {
    const { addressline1, addressline2, state_id, district_id, shippers_id, gstin } = req.body;

    const updateQuery = `
        UPDATE loadart.shippers
        SET 
            address1 = $1,
            address2 = $2,
            state_id = $3,
            district_id = $4,
            gstin = $5 
        WHERE 
            shippers_id = $6 
        RETURNING *; 
    `;

    const updateValues = [addressline1, addressline2, state_id, district_id, gstin, shippers_id];

    try {
        const result = await pool.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Shipper not found or no changes made." });
        }

        res.status(200).json({
            message: "Shipper updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating Shipper:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const insertShipperDocs = async (req, res) => {
    const { shippers_id, shippers_doc } = req.body;

    if (!shippers_id || !shippers_doc || shippers_doc.length === 0) {
        return res.status(400).json({ message: "Shippers id and document details are required." });
    }

    const insertDocsQuery = `
        INSERT INTO loadart.shipper_docs 
        (shipper_docs_name, doc_types_id, shipper_docs_images, shippers_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    try {
        await pool.query("BEGIN");

        const insertedDocs = [];
        for (const doc of shippers_doc) {
            const { name, type_id, image } = doc;
            const insertResult = await pool.query(insertDocsQuery, [
                name,
                type_id,
                image,
                shippers_id,
            ]);
            insertedDocs.push(insertResult.rows[0]);
        }

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Document details inserted successfully.",
            shippers_doc: insertedDocs,
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error inserting Shippers docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
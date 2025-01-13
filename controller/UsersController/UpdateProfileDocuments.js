import pool from "../../Model/Config.js";

export const insertTransporterDocs = async (req, res) => {
    const { transporters_id, transporter_docs } = req.body;

    if (!transporters_id || !transporter_docs || transporter_docs.length === 0) {
        return res.status(400).json({ message: "Transporter ID and document details are required." });
    }

    const selectQuery = `
        SELECT * 
        FROM loadart.transporter_docs 
        WHERE transpoters_id = $1 AND transporter_docs_name = $2;
    `;

    const insertQuery = `
        INSERT INTO loadart.transporter_docs 
        (transporter_docs_name, doc_types_id, transporter_docs_images, transpoters_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const updateQuery = `
        UPDATE loadart.transporter_docs
        SET 
            doc_types_id = $1,
            transporter_docs_images = $2
        WHERE 
            transpoters_id = $3 AND transporter_docs_name = $4
        RETURNING *;
    `;

    try {
        await pool.query("BEGIN");

        const processedDocs = [];
        for (const doc of transporter_docs) {
            const { name, type_id, image } = doc;

            // Check if the row already exists
            const existingDoc = await pool.query(selectQuery, [transporters_id, name]);

            if (existingDoc.rows.length > 0) {
                // Update existing row
                const updatedDoc = await pool.query(updateQuery, [
                    type_id,
                    image,
                    transporters_id,
                    name,
                ]);
                processedDocs.push(updatedDoc.rows[0]);
            } else {
                // Insert new row
                const insertedDoc = await pool.query(insertQuery, [
                    name,
                    type_id,
                    image,
                    transporters_id,
                ]);
                processedDocs.push(insertedDoc.rows[0]);
            }
        }

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Document details processed successfully.",
            transporter_docs: processedDocs,
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error processing transporter docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

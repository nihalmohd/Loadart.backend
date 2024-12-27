import pool from "../Model/Config.js";

export const insertTransporterDocs = async (req, res) => {
    const { transporters_id, transporter_docs } = req.body;

    if (!transporters_id || !transporter_docs || transporter_docs.length === 0) {
        return res.status(400).json({ message: "Transporter ID and document details are required." });
    }

    const insertDocsQuery = `
        INSERT INTO loadart.transporter_docs 
        (transporter_docs_name, doc_types_id, transporter_docs_images, transpoters_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    try {
        await pool.query("BEGIN");

        const insertedDocs = [];
        for (const doc of transporter_docs) {
            const { name, type_id, image } = doc;
            const insertResult = await pool.query(insertDocsQuery, [
                name,
                type_id,
                image,
                transporters_id,
            ]);
            insertedDocs.push(insertResult.rows[0]);
        }

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Document details inserted successfully.",
            transporter_docs: insertedDocs,
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error inserting transporter docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

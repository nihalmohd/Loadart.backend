import pool from "../Model/Config.js";

export const updateGstnAndInsertDocs = async (req, res) => {
    const {
        transporters_id,
        gstn,
        transporter_docs_name,
        doc_types_id,
        transporter_docs_images,
    } = req.body;

    const updateQuery = `
        UPDATE loadart.transporters
        SET gstin = $1
        WHERE transporters_id = $2
        RETURNING *; -- Return the updated row
    `;

    const updateValues = [gstn, transporters_id];


    const insertDocsQuery = `
        INSERT INTO loadart.transporter_docs 
        ( transporter_docs_name, doc_types_id, transporter_docs_images,transpoters_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *; -- Return the inserted row
    `;

    const insertDocsValues = [
        transporter_docs_name,
        doc_types_id,
        transporter_docs_images,
        transporters_id,
    ];

    try {

        await pool.query('BEGIN');


        const updateResult = await pool.query(updateQuery, updateValues);
        if (updateResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: "Transporter not found or no changes made." });
        }

        const insertResult = await pool.query(insertDocsQuery, insertDocsValues);


        await pool.query('COMMIT');


        res.status(200).json({
            message: "GSTN updated and document details inserted successfully",
            transporter: updateResult.rows[0],
            transporter_docs: insertResult.rows[0],
        });
    } catch (error) {

        await pool.query('ROLLBACK');
        console.error("Error updating GSTN or inserting transporter docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

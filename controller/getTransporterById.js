import pool from "../Model/Config.js";

export const getTransporterById = async (req, res) => {
    const { transporters_id } = req.query; // Retrieve transporters_id from query parameters

    // Validate transporters_id
    if (!transporters_id) {
        return res.status(400).json({ message: "Transporter ID is required." });
    }

    const fetchDocumentQuery = `
        SELECT *
        FROM loadart.transporters
        WHERE "transporters_id" = $1
        LIMIT 1;
    `;

    try {
        const result = await pool.query(fetchDocumentQuery, [transporters_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No transporter found for the given transporter ID." });
        }

        res.status(200).json({
            message: "Transporter retrieved successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error retrieving transporter:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getDocumentsByTransporterId = async (req, res) => {
    const { transporters_id } = req.query; 

    if (!transporters_id) {
        return res.status(400).json({ message: "Transporter ID is required." });
    }

    const fetchDocumentsQuery = `
        SELECT *
        FROM loadart.transporter_docs
        WHERE "transpoters_id" = $1;
    `;

    try {
        const result = await pool.query(fetchDocumentsQuery, [transporters_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No documents found for the given transporter ID." });
        }

        res.status(200).json({
            message: "Documents retrieved successfully.",
            data: result.rows,  
        });
    } catch (error) {
        console.error("Error retrieving documents:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

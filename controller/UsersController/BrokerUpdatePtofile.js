import pool from "../../Model/Config.js";

export const updateBrokerBasicDetails = async (req, res) => {
    const { addressline1, addressline2, state_id, district_id, brokers_id, gstin } = req.body;

    const updateQuery = `
        UPDATE loadart.brokers
        SET 
            address1 = $1,
            address2 = $2,
            states_id = $3,
            districts_id = $4,
            gstin = $5 
        WHERE 
            brokers_id = $6 
        RETURNING *; 
    `;

    const updateValues = [addressline1, addressline2, state_id, district_id, gstin, brokers_id];

    try {
        const result = await pool.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Broker not found or no changes made." });
        }

        res.status(200).json({
            message: "Broker updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating Broker:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const insertBrokerDocs = async (req, res) => {
    const { brokers_id, brokers_docs } = req.body;

    if (!brokers_id || !brokers_docs || brokers_docs.length === 0) {
        return res.status(400).json({ message: "brokers id and document details are required." });
    }

    const insertDocsQuery = `
        INSERT INTO loadart.broker_docs 
        (broker_docs_name, doc_types_id, broker_docs_images, brokers_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    try {
        await pool.query("BEGIN");

        const insertedDocs = [];
        for (const doc of brokers_docs) {
            const { name, type_id, image } = doc;
            const insertResult = await pool.query(insertDocsQuery, [
                name,
                type_id,
                image,
                brokers_id,
            ]);
            insertedDocs.push(insertResult.rows[0]);
        }

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Document details inserted successfully.",
            brokers_docs: insertedDocs,
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error inserting brokers docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBrokerById = async (req, res) => {
    const { brokers_id} = req.query; 

    
    if (!brokers_id) {
        return res.status(400).json({ message: "Broker ID is required." });
    }

    const fetchDocumentQuery = `
        SELECT *
        FROM loadart.brokers
        WHERE "brokers_id" = $1
        LIMIT 1;
    `;

    try {
        const result = await pool.query(fetchDocumentQuery, [brokers_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No Broker found for the given Broker ID." });
        }

        res.status(200).json({
            message: "Broker retrieved successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error retrieving Broker:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getDocumentsBybrokersId = async (req, res) => {
    const { brokers_id } = req.query; 

    if (!brokers_id) {
        return res.status(400).json({ message: "Broker ID is required." });
    }

    const fetchDocumentsQuery = `
        SELECT *
        FROM loadart.broker_docs
        WHERE "brokers_id" = $1;
    `;

    try {
        const result = await pool.query(fetchDocumentsQuery, [brokers_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No documents found for the given Broker ID." });
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

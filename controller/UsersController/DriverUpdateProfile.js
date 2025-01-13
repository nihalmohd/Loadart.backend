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

export const insertDriverDocs = async (req, res) => {
    const { drivers_id, drivers_doc } = req.body;

    if (!drivers_id || !drivers_doc || drivers_doc.length === 0) {
        return res.status(400).json({ message: "Drivers id and document details are required." });
    }

    const insertDocsQuery = `
        INSERT INTO loadart.driver_docs
        (driver_docs_name, doc_types_id, driver_docs_images, drivers_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    try {
        await pool.query("BEGIN");

        const insertedDocs = [];
        for (const doc of drivers_doc) {
            const { name, type_id, image } = doc;
            const insertResult = await pool.query(insertDocsQuery, [
                name,
                type_id,
                image,
                drivers_id,
            ]);
            insertedDocs.push(insertResult.rows[0]);
        }

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Document details inserted successfully.",
            drivers_doc: insertedDocs,
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error inserting Drivers docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDriverById = async (req, res) => {
    const { drivers_id} = req.query; 

    
    if (!drivers_id) {
        return res.status(400).json({ message: "Driver ID is required." });
    }

    const fetchDocumentQuery = `
        SELECT *
        FROM loadart.drivers
        WHERE "drivers_id" = $1
        LIMIT 1;
    `;

    try {
        const result = await pool.query(fetchDocumentQuery, [drivers_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No Driver found for the given Driver ID." });
        }

        res.status(200).json({
            message: "Driver retrieved successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error retrieving Driver:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDocumentsByDriverId = async (req, res) => {
    const { drivers_id } = req.query; 

    if (!drivers_id) {
        return res.status(400).json({ message: "Driver ID is required." });
    }

    const fetchDocumentsQuery = `
        SELECT *
        FROM loadart.driver_docs
        WHERE "drivers_id" = $1;
    `;

    try {
        const result = await pool.query(fetchDocumentsQuery, [drivers_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No documents found for the given Driver ID." });
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

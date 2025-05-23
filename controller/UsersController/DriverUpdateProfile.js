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
        return res.status(400).json({ message: "Drivers ID and document details are required." });
    }

    const selectQuery = `
        SELECT * 
        FROM loadart.driver_docs 
        WHERE drivers_id = $1 AND driver_docs_name = $2;
    `;

    const insertQuery = `
        INSERT INTO loadart.driver_docs
        (driver_docs_name, doc_types_id, driver_docs_images, drivers_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const updateQuery = `
        UPDATE loadart.driver_docs
        SET 
            doc_types_id = $1,
            driver_docs_images = $2
        WHERE 
            drivers_id = $3 AND driver_docs_name = $4
        RETURNING *;
    `;

    try {
        await pool.query("BEGIN");

        const processedDocs = [];
        for (const doc of drivers_doc) {
            const { name, type_id, image } = doc;

            // Check if the record already exists
            const existingDoc = await pool.query(selectQuery, [drivers_id, name]);

            if (existingDoc.rows.length > 0) {
                // Update existing record
                const updatedDoc = await pool.query(updateQuery, [
                    type_id,
                    image,
                    drivers_id,
                    name,
                ]);
                processedDocs.push(updatedDoc.rows[0]);
            } else {
                // Insert new record
                const insertedDoc = await pool.query(insertQuery, [
                    name,
                    type_id,
                    image,
                    drivers_id,
                ]);
                processedDocs.push(insertedDoc.rows[0]);
            }
        }

        await pool.query("COMMIT");

        res.status(200).json({
            message: "Document details processed successfully.",
            drivers_doc: processedDocs,
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error processing Drivers docs:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDriverById = async (req, res) => {
    const { drivers_id, user_id } = req.query;

    if (!drivers_id || !user_id) {
        return res.status(400).json({ message: "Both driver ID and user ID are required." });
    }

    const fetchDriverQuery = `
        SELECT *
        FROM loadart.drivers
        WHERE "drivers_id" = $1
        LIMIT 1;
    `;

    const fetchUserSubscriptionQuery = `
        SELECT 
            us.*, 
            sp."name", 
            sp."price", 
            sp."currency", 
            sp."features", 
            sp."description", 
            sp."offerPrice", 
            sp."status" as plan_status
        FROM loadart."UserSubscription" us
        INNER JOIN loadart."SubscriptionPlan" sp
        ON us."planId" = sp."SubscriptionPlanId"
<<<<<<< HEAD
        WHERE us."userId" = $1;
=======
        WHERE us."userId" = $1 and us.status=1;
>>>>>>> 6bcf85cfb5fff1f4fbb95ce40204844516d01084
    `;

    try {
        const driverResult = await pool.query(fetchDriverQuery, [drivers_id]);
        const subscriptionResult = await pool.query(fetchUserSubscriptionQuery, [user_id]);

        if (driverResult.rows.length === 0) {
            return res.status(200).json({ message: "No Driver found for the given Driver ID." });
        }

        res.status(200).json({
            message: "Driver and Subscription details retrieved successfully.",
            data: driverResult.rows[0],
            subscription: subscriptionResult.rows.length > 0 ? subscriptionResult.rows : [],
        });
    } catch (error) {
        console.error("Error retrieving data:", error.message);
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

import pool from "../../Model/Config.js";

export const insertBidsLoad = async (req, res) => {
    const { bidsLoad_amount, load_id, user_id, trucks_id } = req.body;

    try {
        if (!bidsLoad_amount || !load_id || !user_id || !trucks_id) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Insert into bidsLoad table
        const bidsLoadQuery = `
            INSERT INTO Loadart."bidsLoad" ("bidsLoad_amount", "load_id", "user_id", "trucks_id")  
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const bidsLoadResult = await pool.query(bidsLoadQuery, [
            bidsLoad_amount,
            load_id,
            user_id,
            trucks_id,
        ]);

        if (!bidsLoadResult.rows[0]) {
            return res.status(500).json({ message: "Failed to insert bid." });
        }

        const bidsLoad_id = bidsLoadResult.rows[0].bidsLoad_id;

        // Insert into negotiations table
        const negotiationsQuery = `
            INSERT INTO Loadart."negotiations" ("bid_id", "user_id", "amount", "status")
            VALUES ($1, $2, $3, 6)
            RETURNING *;
        `;

        const negotiationsResult = await pool.query(negotiationsQuery, [
            bidsLoad_id,
            user_id,
            bidsLoad_amount,
        ]);

        res.status(201).json({
            message: "Bid inserted successfully and negotiation record created.",
            bidData: bidsLoadResult.rows[0],
            negotiationData: negotiationsResult.rows[0],
        });
    } catch (error) {
        console.error("Error inserting bid into bidsLoad table and negotiations table:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBidsLoadStatus = async (req, res) => {
    try {
        const { bidsLoad_id } = req.body;

        if (!bidsLoad_id) {
            return res.status(400).json({
                error: "bidsLoad_id is required.",
            });
        }

        const query = `
            UPDATE "loadart"."bidsLoad"
            SET "bidsLoad_status" = 4
            WHERE "bidsLoad_id" = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [bidsLoad_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "No record found with the given bidsLoad_id.",
            });
        }

        return res.status(200).json({
            message: "bidsLoad status updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating bidsLoad status:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};
``
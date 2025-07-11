import pool from "../../Model/Config.js";
import { translateText } from "../../Utils/Translate.js";

export const insertTruckNegotiation = async (req, res) => {
    const { bid_id, user_id, amount } = req.body;

    if (!bid_id || !user_id || !amount) {
        return res.status(400).json({ message: "All fields (bid_id, user_id, amount) are required." });
    }

    const insertQuery = `
        INSERT INTO loadart."truckNegotiations" (bid_id, user_id, amount, status)
        VALUES ($1, $2, $3, 7)
        RETURNING *;
    `;

    const updateBidsTruckQuery = `
        UPDATE loadart."bidsTruck"
        SET "bidsTruck_status" = 7, "bidsTruck_amount" = $2
        WHERE "bidsTruck_id" = $1
        RETURNING *;
    `;

    try {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // Insert negotiation record
            const insertResult = await client.query(insertQuery, [bid_id, user_id, amount]);

            // Update bidsTruck
            const updateBidsTruckResult = await client.query(updateBidsTruckQuery, [bid_id, amount]);

            await client.query("COMMIT");

            res.status(201).json({
                message: "Negotiation inserted and bidsTruck status & amount updated successfully.",
                negotiation: insertResult.rows[0],
                updatedBidsTruck: updateBidsTruckResult.rows[0],
            });
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Transaction error:", error.message);
            res.status(500).json({ message: "Internal server error" });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const insertMyTruckNegotiation = async (req, res) => {
    const { bid_id, user_id, amount } = req.body;

    if (!bid_id || !user_id || !amount) {
        return res.status(400).json({ message: "All fields (bid_id, user_id, amount) are required." });
    }

    const insertQuery = `
        INSERT INTO loadart."truckNegotiations" (bid_id, user_id, amount, status)
        VALUES ($1, $2, $3, 6)
        RETURNING *;
    `;

    const updateBidsTruckQuery = `
        UPDATE loadart."bidsTruck"
        SET "bidsTruck_status" = 6, "bidsTruck_amount" = $2
        WHERE "bidsTruck_id" = $1
        RETURNING *;
    `;

    try {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const insertResult = await client.query(insertQuery, [bid_id, user_id, amount]);
            const updateResult = await client.query(updateBidsTruckQuery, [bid_id, amount]);

            await client.query("COMMIT");

            res.status(201).json({
                message: "Negotiation inserted and bidsTruck status updated successfully.",
                negotiation: insertResult.rows[0],
                updatedBidsTruck: updateResult.rows[0],
            });
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Transaction error:", error.message);
            res.status(500).json({ message: "Internal server error" });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getTruckNegotiationByUserAndBid = async (req, res) => {
    const { bid_id, lang = "en" } = req.query;

    if (!bid_id) {
        return res.status(400).json({ message: "bid_id is required as query parameters." });
    }

    const selectQuery = `
        SELECT 
            n.*,
            u.*
        FROM 
            loadart."truckNegotiations" n
        JOIN 
            loadart.users u
        ON 
            n.user_id = u.users_id
        WHERE 
            n.bid_id = $1
        ORDER BY 
            n."truckNegotiations_id" DESC;
    `;

    try {
        const result = await pool.query(selectQuery, [bid_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No matching negotiation found." });
        }

        // Translate fields
        const translatedNegotiations = await Promise.all(
            result.rows.map(async (item) => {
                const translated = { ...item };

                if (translated.users_name)
                    translated.users_name = await translateText(translated.users_name, lang);

                return translated;
            })
        );

        res.status(200).json({
            message: "Negotiation retrieved successfully.",
            negotiation: translatedNegotiations,
        });
    } catch (error) {
        console.error("Error retrieving negotiation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


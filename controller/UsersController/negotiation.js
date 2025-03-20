import pool from "../../Model/Config.js";

export const insertNegotiation = async (req, res) => {
    const { bid_id, user_id, amount } = req.body;

    if (!bid_id || !user_id || !amount ) {
        return res.status(400).json({ message: "All fields (bid_id, user_id, amount) are required." });
    }

    const insertQuery = `
        INSERT INTO loadart.negotiations (bid_id, user_id, amount, status)
        VALUES ($1, $2, $3, 7)
        RETURNING *;
    `;

    const updateBidsTruckQuery = `
        UPDATE loadart.bidsTruck
        SET bidsTruck_status = 7
        WHERE bidsTruck_id = $1
        RETURNING *;
    `;

    try {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const insertResult = await client.query(insertQuery, [bid_id, user_id, amount]);
            const updateResult = await client.query(updateBidsTruckQuery, [bid_id]);

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

export const insertMyLoadBidsNegotiation = async (req, res) => {
    const { bid_id, user_id, amount } = req.body;

    if (!bid_id || !user_id || !amount ) {
        return res.status(400).json({ message: "All fields (bid_id, user_id, amount, bidsTruck_id) are required." });
    }

    const insertQuery = `
        INSERT INTO loadart.negotiations (bid_id, user_id, amount, status)
        VALUES ($1, $2, $3, 6)
        RETURNING *;
    `;

    const updateBidsLoadQuery = `
        UPDATE loadart.bidsLoad
        SET bidsLoad_status = 6
        WHERE bidsTruck_id = $1
        RETURNING *;
    `;

    try {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const insertResult = await client.query(insertQuery, [bid_id, user_id, amount]);
            const updateResult = await client.query(updateBidsLoadQuery, [bid_id]);

            await client.query("COMMIT");

            if(insertResult&&updateResult){
                res.status(201).json({
                    message: "Negotiation inserted and BidsLoad status updated successfully.",
                    negotiation: insertResult.rows[0],
                    updatedBidsTruck: updateResult.rows[0],
                });
            }

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



export const getNegotiationByUserAndBid = async (req, res) => {
    const { user_id, bid_id } = req.query;

    if (!user_id || !bid_id) {
        return res.status(400).json({ message: "Both user_id and bid_id are required as query parameters." });
    }

    const selectQuery = `
    SELECT 
        n.*, 
        u.*
    FROM 
        loadart.negotiations n
    JOIN 
        loadart.users u
    ON 
        n.user_id = u.users_id
    WHERE 
        n.user_id = $1 
    AND 
        n.bid_id = $2
    ORDER BY 
        n."negotiations_id" DESC;  -- Sorting by negotiations_id in descending order
`;

    try {
        const result = await pool.query(selectQuery, [user_id, bid_id]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No matching negotiation found." });
        }

        res.status(200).json({
            message: "Negotiation retrieved successfully.",
            negotiation: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving negotiation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

import pool from "../../Model/Config.js";

export const insertTruckNegotiation = async (req, res) => {
    const { bid_id, user_id, amount } = req.body;

    if (!bid_id || !user_id || !amount) {
        return res.status(400).json({ message: "All fields (bid_id, user_id, amount) are required." });
    }

    const insertQuery = `
        INSERT INTO loadart."truckNegotiations" (bid_id, user_id, amount)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    try {
        const result = await pool.query(insertQuery, [bid_id, user_id, amount]);

        res.status(201).json({
            message: "Negotiation inserted successfully.",
            negotiation: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting negotiation:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTruckNegotiationByUserAndBid = async (req, res) => {
    const { user_id, bid_id } = req.query;

    if (!user_id || !bid_id) {
        return res.status(400).json({ message: "Both user_id and bid_id are required as query parameters." });
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
        n.user_id = $1 
    AND 
        n.bid_id = $2
    ORDER BY 
        n."truckNegotiations_id" DESC;  -- Sorting by truckNegotiations_id in descending order
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



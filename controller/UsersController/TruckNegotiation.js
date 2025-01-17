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

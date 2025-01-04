import pool from "../Model/Config.js";

export const insertBidsTruck = async (req, res) => {
    const { bidsTruck_amount, postTrucks_id, user_id, loads_id } = req.body;

    try {
        // Validate required fields
        if (!bidsTruck_amount || !postTrucks_id || !user_id || !loads_id) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // SQL Query to insert data into bidsTruck table
        const query = `
            INSERT INTO Loadart."bidsTruck" 
            ("bidsTruck_amount", "postTrucks_id", "user_id", "loads_id")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        // Execute query with values from req.body
        const result = await pool.query(query, [
            bidsTruck_amount,
            postTrucks_id,
            user_id,
            loads_id,
        ]);

        // Return success response with the inserted row
        res.status(201).json({
            message: "Bid inserted successfully into bidsTruck table.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting data into bidsTruck table:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

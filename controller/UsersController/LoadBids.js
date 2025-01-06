import pool from "../../Model/Config.js";

export const insertBidsLoad = async (req, res) => {
    const { bidsLoad_amount, load_id, user_id, postTrucks_id } = req.body;

    try {
       
        if (!bidsLoad_amount || !load_id || !user_id || !postTrucks_id) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const query = `
            INSERT INTO Loadart."bidsLoad" ("bidsLoad_amount", "load_id", "user_id", "postTrucks_id")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

       
        const result = await pool.query(query, [bidsLoad_amount, load_id, user_id, postTrucks_id]);

      
       return res.status(201).json({
            message: "Bid inserted successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting bid into bidsLoad table:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

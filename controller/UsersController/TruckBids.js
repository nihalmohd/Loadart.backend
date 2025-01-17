import pool from "../../Model/Config.js";

export const insertBidsTruck = async (req, res) => {
    const { bidsTruck_amount, trucks_id, user_id, loads_id } = req.body;

    try {
        if (!bidsTruck_amount || !trucks_id || !user_id || !loads_id) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const query = `
            INSERT INTO Loadart."bidsTruck" 
            ("bidsTruck_amount", "trucks_id", "user_id", "loads_id")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const result = await pool.query(query, [
            bidsTruck_amount,
            trucks_id,
            user_id,
            loads_id,
        ]);

        res.status(201).json({
            message: "Bid inserted successfully into bidsTruck table.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting data into bidsTruck table:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateBidsTruckStatus = async (req, res) => {
    try {
        const { bidsTruck_id } = req.body;

        if (!bidsTruck_id) {
            return res.status(400).json({
                error: "bidsTruck_id is required.",
            });
        }

        const query = `
            UPDATE "loadart"."bidsTruck"
            SET "bidsTruck_status" = 4
            WHERE "bidsTruck_id" = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [bidsTruck_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "No record found with the given bidsTruck_id.",
            });
        }

        return res.status(200).json({
            message: "bidsTruck status updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating bidsTruck status:", error);

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};

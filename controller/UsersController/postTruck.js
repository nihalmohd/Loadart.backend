import pool from "../../Model/Config.js";
import { translateToEnglish } from "../../Utils/Translate.js";

export const insertPostTrucks = async (req, res) => {
    try {
        let { 
            postTrucks_dateTime, 
            postTrucks_from, 
            postTrucks_to, 
            postTrucks_capacity_id, 
            comments, 
            truck_id 
        } = req.body;

        if (!postTrucks_from || !postTrucks_capacity_id || !truck_id) {
            return res.status(400).json({
                error: 'Missing required fields: postTrucks_from, postTrucks_capacity_id, truck_id',
            });
        }

        // Translate fields to English
        const translatedFrom = postTrucks_from ? await translateToEnglish(postTrucks_from) : null;
        const translatedTo = postTrucks_to ? await translateToEnglish(postTrucks_to) : null;
        const translatedComments = comments ? await translateToEnglish(comments) : null;

        // Format datetime if needed
        if (postTrucks_dateTime && !postTrucks_dateTime.includes("-")) {
            const todayDate = new Date().toISOString().split('T')[0];
            postTrucks_dateTime = `${todayDate}T${postTrucks_dateTime}`;
        }

        await pool.query("BEGIN");

        const updateQuery = `
            UPDATE "loadart"."trucks"
            SET "trucks_status" = 5
            WHERE "truck_id" = $1;
        `;
        const updateResult = await pool.query(updateQuery, [truck_id]);

        if (updateResult.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ 
                error: 'No matching truck found with the given truck_id to update trucks_status.' 
            });
        }

        const insertQuery = `
            INSERT INTO "loadart"."postTrucks" 
            ("postTrucks_dateTime", "postTrucks_from", "postTrucks_to", "postTrucks_capacity_id", "comments", "truck_id") 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const insertValues = [
            postTrucks_dateTime || null, 
            translatedFrom, 
            translatedTo, 
            postTrucks_capacity_id, 
            translatedComments, 
            truck_id
        ];

        const insertResult = await pool.query(insertQuery, insertValues);

        await pool.query("COMMIT");

        return res.status(201).json({
            message: 'Truck post created successfully and trucks_status updated.',
            data: insertResult.rows[0],
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error('Error inserting postTrucks:', error);

        if (error.code === '42703') {
            return res.status(400).json({
                error: 'Invalid column name in the query. Please verify your database schema.',
            });
        }

        return res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
        });
    }
};

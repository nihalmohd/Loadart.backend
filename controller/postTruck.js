import pool from "../Model/Config.js";

export const insertPostTrucks = async (req, res) => {
    try {
        // Destructure fields from the request body
        let { 
            postTrucks_dateTime, 
            postTrucks_from, 
            postTrucks_to, 
            postTrucks_capacity_id, 
            comments, 
            truck_id 
        } = req.body;

        // Validate required fields
        if (!postTrucks_dateTime || !postTrucks_from || !postTrucks_to || !postTrucks_capacity_id || !truck_id) {
            return res.status(400).json({
                error: 'Missing required fields: postTrucks_dateTime, postTrucks_from, postTrucks_to, postTrucks_capacity_id, truck_id',
            });
        }

        // Check if postTrucks_dateTime is just a time and prepend today's date if necessary
        if (postTrucks_dateTime && !postTrucks_dateTime.includes("-")) {
            const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            postTrucks_dateTime = `${todayDate}T${postTrucks_dateTime}`; // Prepend today's date
        }

        // SQL query for inserting data into the postTrucks table with correct case sensitivity
        const query = `
            INSERT INTO "loadart"."postTrucks" 
            ("postTrucks_dateTime", "postTrucks_from", "postTrucks_to", "postTrucks_capacity_id", "comments", "truck_id") 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        // Values to insert into the query
        const values = [
            postTrucks_dateTime, 
            postTrucks_from, 
            postTrucks_to, 
            postTrucks_capacity_id, 
            comments || null, // Default to null if comments are not provided
            truck_id
        ];

        // Execute the query
        const result = await pool.query(query, values);

        // Respond with success
        return res.status(201).json({
            message: 'Truck post created successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error inserting postTrucks:', error);

        // Return a detailed error message for debugging
        if (error.code === '42703') {
            return res.status(400).json({
                error: 'Invalid column name in the query. Please verify your database schema.',
            });
        }

        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

import pool from "../../Model/Config.js";
import { generateAccessToken, generateRefreshToken } from "../../Utils/JwtGenerator.js";

export const Register = async (req, res) => {
    try {
        const { transporters_name, company, transporters_email, transporters_phone, transporters_mob } = req.body;

        if (!transporters_name || !company || !transporters_mob) {
            return res.status(400).json({
                error: 'Missing required fields: transporters_name, company, Mobile number',
            });
        }

        await pool.query('BEGIN');

        // Check if the transporter already exists
        const existingTransporterQuery = `
            SELECT * FROM loadart.transporters WHERE transporters_mob = $1;
        `;
        const existingTransporterResult = await pool.query(existingTransporterQuery, [transporters_mob]);

        if (existingTransporterResult.rows.length > 0) {
            // Get user_types_id for Transporter
            const userTypeFindQuery = `SELECT user_types_id FROM loadart.user_types WHERE user_types_name = 'Transporter';`;
            const userTypefoundResult = await pool.query(userTypeFindQuery);
            const userTypeId = userTypefoundResult.rows[0].user_types_id;

            // Check if a user entry exists
            const userCheckQuery = `
                SELECT * FROM loadart.users WHERE users_mobile = $1 AND user_types_id = $2;
            `;
            const userResult = await pool.query(userCheckQuery, [transporters_mob, userTypeId]);

            // Update transporter details
            const updateTransporterQuery = `
                UPDATE loadart.transporters
                SET 
                    transporters_name = COALESCE($1, transporters_name),
                    company = COALESCE($2, company),
                    transporters_email = COALESCE($3, transporters_email),
                    transporters_phone = COALESCE($4, transporters_phone)
                WHERE transporters_mob = $5
                RETURNING *;
            `;
            const updateTransporterValues = [
                transporters_name, company, transporters_email || null, transporters_phone || null, transporters_mob,
            ];
            const updatedTransporter = await pool.query(updateTransporterQuery, updateTransporterValues);

            // Update user table as well
            if (userResult.rows.length > 0) {
                const updateUserQuery = `
                    UPDATE loadart.users
                    SET users_name = $1
                    WHERE users_mobile = $2 AND user_types_id = $3
                    RETURNING *;
                `;
                const updateUserValues = [transporters_name, transporters_mob, userTypeId];
                const updatedUser = await pool.query(updateUserQuery, updateUserValues);

                await pool.query('COMMIT');

                const userPayload = { id: transporters_mob, username: transporters_name };
                const accessToken = generateAccessToken(userPayload);
                const refreshToken = generateRefreshToken(userPayload);

                res.cookie('accessToken', accessToken, {
                    httpOnly: true, secure: false, sameSite: 'strict', maxAge: 15 * 60 * 1000,
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.status(200).json({
                    message: 'Transporter and User updated successfully',
                    transporterData: updatedTransporter.rows[0],
                    User: updatedUser.rows[0],
                    accessToken, refreshToken
                });
            } else {
                await pool.query('ROLLBACK');
                return res.status(404).json({ message: "User record not found for update." });
            }
        }

        // If transporter does not exist, register new transporter and user
        const userTypeQuery = `SELECT user_types_id FROM loadart.user_types WHERE user_types_name = 'Transporter';`;
        const userTypeResult = await pool.query(userTypeQuery);
        if (userTypeResult.rows.length === 0) {
            throw new Error('User type "Transporter" not found');
        }
        const userTypeId = userTypeResult.rows[0].user_types_id;

        // Insert transporter
        const transporterQuery = `
            INSERT INTO loadart.transporters (transporters_name, company, transporters_email, transporters_phone, transporters_mob) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const transporterValues = [transporters_name, company, transporters_email || null, transporters_phone || null, transporters_mob];
        const transporterResult = await pool.query(transporterQuery, transporterValues);

        // Insert user
        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const userValues = [transporters_name, transporters_mob, userTypeId];
        const userResult = await pool.query(userQuery, userValues);

        await pool.query('COMMIT');

        const userPayload = { id: transporters_mob, username: transporters_name };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        res.cookie('accessToken', accessToken, {
            httpOnly: true, secure: false, sameSite: 'strict', maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ 
            message: 'Registration successful', 
            transporterData: transporterResult.rows[0], 
            userData: userResult.rows[0], 
            accessToken, refreshToken 
        });

    } catch (error) {
        console.error('Error during registration:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

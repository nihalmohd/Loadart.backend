import pool from "../../Model/Config.js";
import { generateAccessToken, generateRefreshToken } from "../../Utils/JwtGenerator.js";

export const Register = async (req, res) => {
    try {
        const { drivers_name, drivers_email, drivers_phone, drivers_mob } = req.body;

        if (!drivers_name) {
            return res.status(400).json({
                error: 'Missing required fields: drivers_name',
            });
        }

        await pool.query('BEGIN');

        const existingDriverQuery = `
            SELECT * 
            FROM loadart.drivers 
            WHERE drivers_mob = $1;
        `;
        const existingDriverResult = await pool.query(existingDriverQuery, [drivers_mob]);

        const userTypeFindQuery = `
            SELECT user_types_id 
            FROM loadart.user_types 
            WHERE user_types_name = 'Driver';
        `;
        const userTypefoundResult = await pool.query(userTypeFindQuery);

        if (userTypefoundResult.rows.length === 0) {
            throw new Error('User type "Driver" not found');
        }

        const userTypeId = userTypefoundResult.rows[0].user_types_id;

        if (existingDriverResult.rows.length > 0) {
            const query = `
                SELECT * 
                FROM loadart.users 
                WHERE users_mobile = $1 
                AND user_types_id = $2;
            `;
            const result = await pool.query(query, [drivers_mob, userTypeId]);

            const updateDriverQuery = `
                UPDATE loadart.drivers
                SET 
                    drivers_name = COALESCE($1, drivers_name),
                    drivers_email = COALESCE($2, drivers_email),
                    drivers_phone = COALESCE($3, drivers_phone)
                WHERE drivers_mob = $4
                RETURNING *;
            `;
            const updateDriverValues = [
                drivers_name,
                drivers_email || null,
                drivers_phone || null,
                drivers_mob,
            ];
            const updatedDriver = await pool.query(updateDriverQuery, updateDriverValues);

            const updateUserQuery = `
                UPDATE loadart.users
                SET 
                    users_name = COALESCE($1, users_name)
                WHERE users_mobile = $2 AND user_types_id = $3
                RETURNING *;
            `;
            const updatedUser = await pool.query(updateUserQuery, [drivers_name, drivers_mob, userTypeId]);

            if (updatedUser.rows.length === 0) {
                await pool.query('ROLLBACK');
                return res.status(404).json({ error: 'User record not found' });
            }

            await pool.query('COMMIT');

            const userPayload = { id: drivers_mob, username: drivers_name };
            const accessToken = generateAccessToken(userPayload);
            const refreshToken = generateRefreshToken(userPayload);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: 'Driver updated successfully',
                data: updatedDriver.rows[0],
                User: updatedUser.rows[0],
                accessToken,
                refreshToken
            });
        }

        const DriverQuery = `
            INSERT INTO loadart.drivers (drivers_name, drivers_email, drivers_phone, drivers_mob) 
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const DriverValues = [drivers_name, drivers_email || null, drivers_phone || null, drivers_mob];
        const result = await pool.query(DriverQuery, DriverValues);

        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const userValues = [drivers_name, drivers_mob, userTypeId];
        const UserData = await pool.query(userQuery, userValues);

        await pool.query('COMMIT');

        const userPayload = { id: drivers_mob, username: drivers_name };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Registration successful',
            data: result.rows[0],
            accessToken,
            refreshToken,
            User: UserData.rows[0],
        });
    } catch (error) {
        console.error('Error during registration:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

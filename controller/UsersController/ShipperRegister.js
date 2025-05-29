import pool from "../../Model/Config.js";
import { generateAccessToken, generateRefreshToken } from "../../Utils/JwtGenerator.js";

export const Register = async (req, res) => {
    try {
        const { shippers_name, company, shippers_email, shippers_phone, shippers_mob } = req.body;

        if (!company) {
            return res.status(400).json({ error: 'Missing required fields: company' });
        }

        await pool.query('BEGIN');

        const existingShipperQuery = `SELECT * FROM loadart.shippers WHERE shippers_mob = $1;`;
        const existingShipperResult = await pool.query(existingShipperQuery, [shippers_mob]);

        if (existingShipperResult.rows.length > 0) {
            const userTypeFindQuery = `SELECT user_types_id FROM loadart.user_types WHERE user_types_name = 'Shipper';`;
            const userTypefoundResult = await pool.query(userTypeFindQuery);

            if (userTypefoundResult.rows.length === 0) {
                throw new Error('User type "Shipper" not found');
            }

            const userTypeId = userTypefoundResult.rows[0].user_types_id;
            const userCheckQuery = `SELECT * FROM loadart.users WHERE users_mobile = $1 AND user_types_id = $2;`;
            const userResult = await pool.query(userCheckQuery, [shippers_mob, userTypeId]);

            const updateShipperQuery = `
                UPDATE loadart.shippers
                SET 
                    shippers_name = COALESCE($1, shippers_name),
                    company = COALESCE($2, company),
                    shippers_email = COALESCE($3, shippers_email),
                    shippers_phone = COALESCE($4, shippers_phone)
                WHERE shippers_mob = $5
                RETURNING *;
            `;
            const updateShipperValues = [shippers_name, company, shippers_email || null, shippers_phone || null, shippers_mob];
            const updatedShipper = await pool.query(updateShipperQuery, updateShipperValues);

            if (userResult.rows.length > 0) {
                const updateUserQuery = `
                    UPDATE loadart.users
                    SET users_name = $1
                    WHERE users_mobile = $2 AND user_types_id = $3
                    RETURNING *;
                `;
                const updateUserValues = [shippers_name, shippers_mob, userTypeId];
                const updatedUser = await pool.query(updateUserQuery, updateUserValues);

                await pool.query('COMMIT');

                const userPayload = { id: shippers_mob, username: shippers_name };
                const accessToken = generateAccessToken(userPayload);
                const refreshToken = generateRefreshToken(userPayload);

                res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

                return res.status(200).json({
                    message: 'Shipper and User updated successfully',
                    data: updatedShipper.rows[0],
                    User: updatedUser.rows[0],
                    accessToken,
                    refreshToken
                });
            } else {
                await pool.query('ROLLBACK');
                return res.status(404).json({ message: "User record not found for update." });
            }
        }

        const userTypeQuery = `SELECT user_types_id FROM loadart.user_types WHERE user_types_name ='Shipper';`;
        const userTypeResult = await pool.query(userTypeQuery);
        if (userTypeResult.rows.length === 0) {
            throw new Error('User type "Shipper" not found');
        }
        const userTypeId = userTypeResult.rows[0].user_types_id;

        const ShipperQuery = `
            INSERT INTO loadart.shippers (shippers_name, company, shippers_email, shippers_phone, shippers_mob) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const ShipperValues = [shippers_name, company, shippers_email || null, shippers_phone || null, shippers_mob];
        const shipperResult = await pool.query(ShipperQuery, ShipperValues);

        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const userValues = [shippers_name, shippers_mob, userTypeId];
        const userResult = await pool.query(userQuery, userValues);

        await pool.query('COMMIT');

        const userPayload = { id: shippers_mob, username: shippers_name };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ 
            message: 'Registration successful', 
            data: shipperResult.rows[0], 
            User: userResult.rows[0], 
            accessToken, 
            refreshToken 
        });
    } catch (error) {
        console.error('Error during registration:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

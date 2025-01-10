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

      
        const existingTransporterQuery = `
            SELECT * 
            FROM loadart.transporters 
            WHERE transporters_mob = $1;
        `;
        const existingTransporterResult = await pool.query(existingTransporterQuery, [transporters_mob]);

        if (existingTransporterResult.rows.length > 0) {
            const userTypeFindQuery = `
            SELECT user_types_id 
            FROM loadart.user_types 
            WHERE user_types_name = 'Transporter';
        `;
        const userTypefoundResult = await pool.query(userTypeFindQuery);
            const userTypeId = userTypefoundResult.rows[0].user_types_id;
        
            const query = `
                SELECT * 
                FROM loadart.users 
                WHERE users_mobile = $1 
                AND user_types_id = $2;
            `;
        const result = await pool.query(query, [transporters_mob,userTypeId]);

           
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
                transporters_name,
                company,
                transporters_email || null,
                transporters_phone || null,
                transporters_mob,
            ];
            const updatedTransporter = await pool.query(updateTransporterQuery, updateTransporterValues);

            await pool.query('COMMIT');

            return res.status(200).json({
                message: 'Transporter updated successfully',
                data: updatedTransporter.rows[0],
                User: result.rows[0], 
            });
        }

        
        const userTypeQuery = `
            SELECT user_types_id 
            FROM loadart.user_types 
            WHERE user_types_name = 'Transporter';
        `;
        const userTypeResult = await pool.query(userTypeQuery);

        if (userTypeResult.rows.length === 0) {
            throw new Error('User type "Transporter" not found');
        }
        const userTypeId = userTypeResult.rows[0].user_types_id;

        
        const transporterQuery = `
            INSERT INTO loadart.transporters (transporters_name, company, transporters_email, transporters_phone, transporters_mob) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const transporterValues = [transporters_name, company, transporters_email || null, transporters_phone || null, transporters_mob];
        const result = await pool.query(transporterQuery, transporterValues);

        
        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const userValues = [transporters_name, transporters_mob, userTypeId];
        const UserData = await pool.query(userQuery, userValues);

        await pool.query('COMMIT');

        
        const userPayload = { id: transporters_mob, username: transporters_name };
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

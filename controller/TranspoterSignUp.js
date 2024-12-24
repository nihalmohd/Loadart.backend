import pool from "../Model/Config.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/JwtGenerator.js";

export const Register = async (req, res) => {
    try {
        const { transporters_name, company, transporters_email, transporters_phone, transporters_mob } = req.body;

        if (!transporters_name || !company || !transporters_mob) {
            return res.status(400).json({
                error: 'Missing required fields: transporters_name, company,  Mobile number',
            });
        }
    
        await pool.query('BEGIN');

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
        RETURNING *; -- Ensures the inserted row is returned
    `;
        const transporterValues = [transporters_name, company, transporters_email || null, transporters_phone || null, transporters_mob];
        const result = await pool.query(transporterQuery, transporterValues);
    
       

        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3)
            RETURNING *; -- Ensures the inserted row is returned
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

        
        res.status(200).json({ message: 'Registration successful', Data:result.rows[0],accessToken,refreshToken,User:UserData.rows[0] });
        
    } catch (error) {
        console.error('Error during registration:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

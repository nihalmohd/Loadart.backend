import pool from "../../Model/Config.js";
import { generateAccessToken, generateRefreshToken } from "../../Utils/JwtGenerator.js";

export const Register = async (req, res) => {
    try {
        const { brokers_name, company, brokers_email, brokers_phone, brokers_mob } = req.body;

        if (!brokers_name || !brokers_mob) {
            return res.status(400).json({
                error: 'Missing required fields: brokers_name, Mobile number',
            });
        }

        await pool.query('BEGIN');

      
        const existingBrokerrQuery = `
            SELECT * 
            FROM loadart.brokers 
            WHERE brokers_mob = $1;
        `;
        const existingBrokerrResult = await pool.query(existingBrokerrQuery, [brokers_mob]);

    if (existingBrokerrResult.rows.length > 0) {
        const userTypeFindQuery = `
        SELECT user_types_id 
        FROM loadart.user_types 
        WHERE user_types_name = 'Broker';
    `;
    const userTypefoundResult = await pool.query(userTypeFindQuery);
        const userTypeId = userTypefoundResult.rows[0].user_types_id;
    
        const query = `
            SELECT * 
            FROM loadart.users 
            WHERE users_mobile = $1 
            AND user_types_id = $2;
        `;
        const result = await pool.query(query, [brokers_mob, userTypeId]);
    
           
            const updateBrokerrQuery = `
                UPDATE loadart.brokers
                SET 
                    brokers_name = COALESCE($1, brokers_name),
                    company = COALESCE($2, company),
                    brokers_email = COALESCE($3, brokers_email),
                    brokers_phone = COALESCE($4, brokers_phone)
                WHERE brokers_mob = $5
                RETURNING *;
            `;
            const updateBrokerrValues = [
                brokers_name,
                company,
                brokers_email || null,
                brokers_phone || null,
                brokers_mob,
            ];
            const updatedBrokerr = await pool.query(updateBrokerrQuery, updateBrokerrValues);

            await pool.query('COMMIT');
            const userPayload = { id: brokers_mob, username: brokers_name };
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
                message: 'Broker updated successfully',
                data: updatedBrokerr.rows[0],
                User: result.rows[0],
                accessToken, 
                refreshToken    
            });
        }

        
        const userTypeQuery = `
            SELECT user_types_id 
            FROM loadart.user_types 
            WHERE user_types_name = 'Broker';
        `;
        const userTypeResult = await pool.query(userTypeQuery);

        if (userTypeResult.rows.length === 0) {
            throw new Error('User type "Broker" not found');
        }
        const userTypeId = userTypeResult.rows[0].user_types_id;

        
        const BrokerrQuery = `
            INSERT INTO loadart.brokers (brokers_name, company, brokers_email, brokers_phone, brokers_mob) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const BrokerrValues = [brokers_name, company || null, brokers_email || null, brokers_phone || null, brokers_mob];
        const result = await pool.query(BrokerrQuery, BrokerrValues);

        
        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const userValues = [brokers_name, brokers_mob, userTypeId];
        const UserData = await pool.query(userQuery, userValues);

        await pool.query('COMMIT');

        
        const userPayload = { id: brokers_mob, username: brokers_name };
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

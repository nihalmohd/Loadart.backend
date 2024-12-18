import pool from "../Model/Config.js";

export const Register = async (req, res) => {
    try {
        const { transporters_name, company, transporters_email, transporters_phone, MobileNumber } = req.body;


        if (!transporters_name || !company || !transporters_phone || !MobileNumber ) {
            return res.status(400).json({
                error: 'Missing required fields: transporters_name, company, transporters_phone, Mobile number',
            });
        }

        await pool.query('BEGIN');
        const checkMobileQuery = `
        SELECT transporters_mob 
        FROM loadart.transporters 
        WHERE transporters_mob = $1;
    `;
    const mobileResult = await pool.query(checkMobileQuery, [MobileNumber]);
    if (mobileResult.rows.length > 0) {
        return res.status(409).json({
            error: 'Mobile number already exists',
            status: 'Conflict detected',
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
            VALUES ($1, $2, $3, $4, $5);
        `;
        const transporterValues = [transporters_name, company, transporters_email || null, transporters_phone, MobileNumber];
        await pool.query(transporterQuery, transporterValues);

        const userQuery = `
            INSERT INTO loadart.users (users_name, users_mobile, user_types_id) 
            VALUES ($1, $2, $3);
        `;
        const userValues = [transporters_name, MobileNumber, userTypeId];
        await pool.query(userQuery, userValues);

        await pool.query('COMMIT');

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

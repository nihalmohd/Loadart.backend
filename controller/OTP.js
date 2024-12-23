import axios from 'axios';
import pool from '../Model/Config.js';

let generatedOtp = null;

export const SentOtp = async (req, res) => {
    const { MobileNumber } = req.body;

    if (!MobileNumber) {
        return res.status(400).json({ error: 'Mobile number is required' });
    }

    try {
        generatedOtp = Math.floor(1000 + Math.random() * 9000);

        const username = process.env.SMS_USERNAME;
        const password = process.env.SMS_PASSWORD;
        const senderId = process.env.SENDER_ID;
        const tid = process.env.TID;
        const message = `Hi ${MobileNumber}, Your login OTP is ${generatedOtp} for TMK. CVS Info Solutions`;


        const response = await axios.post(
            `https://sapteleservices.com/SMS_API/sendsms.php?username=${username}&password=${password}&mobile=${MobileNumber}&sendername=${senderId}&message=${message}&routetype=1&tid=${tid}`
        );

        if (response.status === 200) {
            res.status(200).json({ message: 'OTP sent successfully!' });
        } else {
            res.status(400).json({ message: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Error during OTP sending:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


export const VerifyOTP = async (req, res) => {
    const { MobileNumber, otp } = req.body;
    if (!MobileNumber || !otp) {
        return res.status(400).json({ error: 'Mobile number and OTP are required' });
    }
    try {
        if (otp == generatedOtp) {
            const checkMobileQuery = `
                SELECT *
                FROM loadart.transporters 
                WHERE transporters_mob = $1;
            `;
            const mobileResult = await pool.query(checkMobileQuery, [MobileNumber]);

            if (mobileResult.rows.length > 0) {

                res.status(200).json({ 
                    message: 'OTP verified successfully!',
                    data: mobileResult.rows[0], 
                });
                generatedOtp = null;
            } else {

                res.status(404).json({ error: 'Data not found' });
            }
        } else {

            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

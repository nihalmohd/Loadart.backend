import axios from 'axios';

let generatedOtp = null;

export const SentOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  generatedOtp = Math.floor(100000 + Math.random() * 900000);

  const apiKey = "1607100000000330634";
  const senderId = 'CVSIFS';
  const apiUrl = `http://sapteleservices.com/SMS_API/sendsms.php`;

  const params = {
    mobile: phoneNumber,
    message: `Hi ${phoneNumber}, Your login OTP is ${generatedOtp} for TMK. CVS Info Solutions`,
    sender: senderId,
    authkey: apiKey,
  };

  try {
    const response = await axios.get(apiUrl, { params });
    console.log('Full Response:', response.data);

    if (response.status === 200) {
      res.json({ message: 'OTP sent successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error Details:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

export const VerifyOTP = (req,res)=>{
    const { phoneNumber, otp } = req.body;

    if (otp == generatedOtp) {
      res.json({ message: 'OTP verified successfully!' });
      generatedOtp = null; 
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
}
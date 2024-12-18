import axios from 'axios';

let generatedOtp = null;

export const SentOtp = async(req,res)=>{
    const { MobileNumber } = req.body;


  generatedOtp = Math.floor(1000 + Math.random() * 9000);

  const username = process.env.SMS_USERNAME;
  const password = process.env.SMS_PASSWORD;
  const senderId = process.env.SENDER_ID;
  const tid = process.env.TID;
  const mobile = MobileNumber
  const message = `Hi ${mobile}, Your login OTP is ${generatedOtp} for TMK. CVS Info Solutions`
  try {
    const response = await axios.post(`https://sapteleservices.com/SMS_API/sendsms.php?username=${username}&password=${password}&mobile=${mobile}&sendername=${senderId}&message=${message}&routetype=1&tid=${tid}`);
     if (response.status === 200) {
      res.status(200).json({ message: 'OTP sent successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
}

export const VerifyOTP = (req,res)=>{
    const { MobileNumber, otp } = req.body;

    if (otp == generatedOtp) {
      res.json({ message: 'OTP verified successfully!' });
      generatedOtp = null; 
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
}
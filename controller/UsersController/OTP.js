import axios from "axios";
import pool from "../../Model/Config.js";

const otpStore = new Map();

export const SentOtp = async (req, res) => {

  const { transporters_mob } = req.body;
    
  if (!transporters_mob) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  try {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    const expiry = Date.now() + 5 * 60 * 1000;
    otpStore.set(transporters_mob, { otp: generatedOtp, expiry });
    const username = process.env.SMS_USERNAME;
    const password = process.env.SMS_PASSWORD;
    const senderId = process.env.SENDER_ID;
    const tid = process.env.TID;
    const message = `Hi ${transporters_mob}, Your login OTP is ${generatedOtp} for TMK. CVS Info Solutions`;
    console.log(generatedOtp);
    
    const response = await axios.post(
      `https://sapteleservices.com/SMS_API/sendsms.php?username=${username}&password=${password}&mobile=${transporters_mob}&sendername=${senderId}&message=${message}&routetype=1&tid=${tid}`
    );

    if (response.status === 200) {
      res.status(200).json({ message: "OTP sent successfully!" });
    } else {
      res.status(400).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error during OTP sending:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const VerifyOTP = async (req, res) => {
  const { transporters_mob, otp } = req.body;

  if (!transporters_mob || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" });
  }

  try {
    const storedData = otpStore.get(transporters_mob);

    if (!storedData) {
      return res
        .status(400)
        .json({ error: "No OTP found for this mobile number" }); 
    }

    const { otp: storedOtp, expiry } = storedData;

    if (parseInt(otp) !== storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > expiry) {
      otpStore.delete(transporters_mob);
      return res.status(400).json({ error: "OTP has expired" });
    }

    otpStore.delete(transporters_mob);

    const checkMobileQuery = `
    SELECT *
    FROM loadart.transporters 
    WHERE transporters_mob = $1;
`;
    const mobileResult = await pool.query(checkMobileQuery, [transporters_mob]);

    if (mobileResult.rows.length === 0) {
      return res.status(200).json({
        message: "OTP verified successfully, but no transporter data found.",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully!",
      data: mobileResult.rows[0],
    });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
};


export const BrokerVerifyOTP = async (req, res) => {
  const { brokers_mob, otp } = req.body;
 console.log(brokers_mob,otp);
 
  if (!brokers_mob || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" }); 
  }

  try {
    const storedData = otpStore.get(brokers_mob);

    if (!storedData) {
      return res
        .status(400)
        .json({ error: "No OTP found for this mobile number" }); 
    }

    const { otp: storedOtp, expiry } = storedData;
    console.log("hello");

    if (parseInt(otp) !== storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > expiry) {
      otpStore.delete(brokers_mob);
      return res.status(400).json({ error: "OTP has expired" });
    }

    otpStore.delete(brokers_mob);

    const checkMobileQuery = `
    SELECT *
    FROM loadart.brokers 
    WHERE brokers_mob = $1;
`;
    const mobileResult = await pool.query(checkMobileQuery, [brokers_mob]);
    

    if (mobileResult.rows.length === 0) {
      return res.status(200).json({
        message: "OTP verified successfully, but no broker data found.",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully!",
      data: mobileResult.rows[0],
    });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
}; 

export const DriverVerifyOTP = async (req, res) => {
  const { drivers_mob, otp } = req.body;

  if (!drivers_mob || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" });
  }

  try {
    const storedData = otpStore.get(drivers_mob);

    if (!storedData) {
      return res
        .status(400)
        .json({ error: "No OTP found for this mobile number" }); 
    }

    const { otp: storedOtp, expiry } = storedData;

    if (parseInt(otp) !== storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > expiry) {
      otpStore.delete(drivers_mob);
      return res.status(400).json({ error: "OTP has expired" });
    }

    otpStore.delete(drivers_mob);

    const checkMobileQuery = `
    SELECT *
    FROM loadart.drivers 
    WHERE drivers_mob = $1;
`;
    const mobileResult = await pool.query(checkMobileQuery, [drivers_mob]);

    if (mobileResult.rows.length === 0) {
      return res.status(200).json({
        message: "OTP verified successfully, but no driver data found.",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully!",
      data: mobileResult.rows[0],
    });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
};
export const ShipperVerifyOTP = async (req, res) => {
  const { shippers_mob, otp } = req.body; 

  if (!shippers_mob || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" });
  }

  try {
    const storedData = otpStore.get(shippers_mob);

    if (!storedData) {
      return res
        .status(400)
        .json({ error: "No OTP found for this mobile number" }); 
    }

    const { otp: storedOtp, expiry } = storedData;

    if (parseInt(otp) !== storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > expiry) {
      otpStore.delete(shippers_mob);
      return res.status(400).json({ error: "OTP has expired" });
    }

    otpStore.delete(shippers_mob);

    const checkMobileQuery = `
    SELECT *
    FROM loadart.shippers 
    WHERE shippers_mob = $1;
`;
    const mobileResult = await pool.query(checkMobileQuery, [shippers_mob]);

    if (mobileResult.rows.length === 0) {
      return res.status(200).json({
        message: "OTP verified successfully, but no broker data found.",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully!",
      data: mobileResult.rows[0],
    });
  } catch (error) {
    console.error("Error during OTP verification:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
};



import express from 'express';
import { Register } from '../controller/TranspoterSignUp.js';
import { SentOtp, VerifyOTP } from '../controller/OTP.js';
import { Refresh } from '../controller/CheckingAccessToken.js';
import { Logout } from '../controller/Logout.js';


export const TranspoterRouter = express.Router()

TranspoterRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Transpoter side call recieved!");
    console.log("Hello, Loadart Transpoter side call recieved!");
    
});

TranspoterRouter.post("/Register",Register)
TranspoterRouter.post("/send-otp",SentOtp)
TranspoterRouter.post("/Verify-otp",VerifyOTP)
TranspoterRouter.post("/Refresh",Refresh)

TranspoterRouter.get("/Logout",Logout)


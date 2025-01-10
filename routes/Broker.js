import express from 'express';
import { SentOtp, VerifyOTP } from '../controller/UsersController/OTP.js';
import { Register } from '../controller/UsersController/BrokerRegister.js';
import { insertBrokerDocs, updateBrokerBasicDetails } from '../controller/UsersController/BrokerUpdatePtofile.js';


export const BrokerRouter = express.Router()


BrokerRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Broker side call recieved!");
    console.log("Hello, Loadart Broker side call recieved!");
    
});
//get//

//post//
BrokerRouter.post("/send-otp",SentOtp)
BrokerRouter.post("/Verify-otp",VerifyOTP)
BrokerRouter.post("/Register",Register)
BrokerRouter.post("/insertBrokerProfileDoc",insertBrokerDocs)

//patch//
BrokerRouter.patch("/UpdateBrokerProfile",updateBrokerBasicDetails)

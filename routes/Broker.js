import express from 'express';
import { BrokerVerifyOTP, SentOtp, VerifyOTP } from '../controller/UsersController/OTP.js';
import { Register } from '../controller/UsersController/BrokerRegister.js';
import { getBrokerById, getDocumentsBybrokersId, insertBrokerDocs, updateBrokerBasicDetails } from '../controller/UsersController/BrokerUpdatePtofile.js';
import { getAllLoads } from '../controller/UsersController/getLoads.js';
import { getPaginatedTrucks } from '../controller/UsersController/getTrucks.js';


export const BrokerRouter = express.Router()


BrokerRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Broker side call recieved!");
    console.log("Hello, Loadart Broker side call recieved!");
    
});
//get//
BrokerRouter.get("/getBrokerById",getBrokerById)
BrokerRouter.get("/getDocumentsBybrokersId",getDocumentsBybrokersId)
BrokerRouter.get("/getAllLoads",getAllLoads)
BrokerRouter.get("/getAllTrucks",getPaginatedTrucks)

//post//
BrokerRouter.post("/send-otp",SentOtp)
BrokerRouter.post("/Verify-otp",BrokerVerifyOTP)
BrokerRouter.post("/Register",Register)
BrokerRouter.post("/insertBrokerProfileDoc",insertBrokerDocs)

//patch// 
BrokerRouter.patch("/UpdateBrokerProfile",updateBrokerBasicDetails) 

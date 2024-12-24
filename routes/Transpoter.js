import express from 'express';
import { Register } from '../controller/TranspoterSignUp.js';
import { SentOtp, VerifyOTP } from '../controller/OTP.js';
import { Refresh } from '../controller/CheckingAccessToken.js';
import { Logout } from '../controller/Logout.js';
import { updateTransporterBasicDetails } from '../controller/UpdateProfile.js';
import { updateGstnAndInsertDocs } from '../controller/UpdateProfileDocuments.js';
import { addLoad } from '../controller/AddLoad.js';


export const TranspoterRouter = express.Router()

TranspoterRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Transpoter side call recieved!");
    console.log("Hello, Loadart Transpoter side call recieved!");
    
});

TranspoterRouter.post("/Register",Register)
TranspoterRouter.post("/send-otp",SentOtp)
TranspoterRouter.post("/Verify-otp",VerifyOTP)
TranspoterRouter.post("/updateTransporterBasicDetails",updateTransporterBasicDetails)
TranspoterRouter.post("/updateTransporterDocumentsDetails",updateGstnAndInsertDocs)
TranspoterRouter.post("/AddLoad",addLoad)


TranspoterRouter.get("/Refresh",Refresh)
TranspoterRouter.get("/Logout",Logout)


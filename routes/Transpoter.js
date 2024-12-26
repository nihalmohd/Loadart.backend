import express from 'express';
import { Register } from '../controller/TranspoterSignUp.js';
import { SentOtp, VerifyOTP } from '../controller/OTP.js';
import { Refresh } from '../controller/CheckingAccessToken.js';
import { Logout } from '../controller/Logout.js';
import { updateTransporterBasicDetails } from '../controller/UpdateProfile.js';
import { updateGstnAndInsertDocs } from '../controller/UpdateProfileDocuments.js';
import { addLoad } from '../controller/AddLoad.js';
import { getLoadsByUserId } from '../controller/GetLoadsByUserid.js';
import { getAllStates } from '../controller/getAllStates.js';
import { getDistrictsByStateId } from '../controller/getDistrictsByStateid.js';
import { getDocumentsByTransporterId, getTransporterById } from '../controller/getTransporterById.js';



export const TranspoterRouter = express.Router()

TranspoterRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Transpoter side call recieved!");
    console.log("Hello, Loadart Transpoter side call recieved!");
    
});
TranspoterRouter.get("/Refresh",Refresh)
TranspoterRouter.get("/Logout",Logout)
TranspoterRouter.get("/getLoadsByUserId", getLoadsByUserId);
TranspoterRouter.get("/getAllStates", getAllStates);
TranspoterRouter.get("/getDistrictsByStateId", getDistrictsByStateId);
TranspoterRouter.get("/getTranporterById", getTransporterById);
TranspoterRouter.get("/getDocumentsByTransporterId", getDocumentsByTransporterId);

TranspoterRouter.post("/Register",Register)
TranspoterRouter.post("/send-otp",SentOtp)
TranspoterRouter.post("/Verify-otp",VerifyOTP)
TranspoterRouter.post("/updateTransporterBasicDetails",updateTransporterBasicDetails)
TranspoterRouter.post("/updateTransporterDocumentsDetails",updateGstnAndInsertDocs)
TranspoterRouter.post("/AddLoad",addLoad)




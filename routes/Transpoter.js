import express from 'express';
import { Register } from '../controller/TranspoterSignUp.js';
import { SentOtp, VerifyOTP } from '../controller/OTP.js';
import { Refresh } from '../controller/CheckingAccessToken.js';
import { Logout } from '../controller/Logout.js';
import { updateTransporterBasicDetails } from '../controller/UpdateProfile.js';
import { insertTransporterDocs } from '../controller/UpdateProfileDocuments.js';
import { addLoad } from '../controller/AddLoad.js';
import { getLoadsByUserId } from '../controller/GetLoadsByUserid.js';
import { getAllStates } from '../controller/getAllStates.js';
import { getDistrictsByStateId } from '../controller/getDistrictsByStateid.js';
import { getDocumentsByTransporterId, getTransporterById } from '../controller/getTransporterById.js';
import { getAllMaterials } from '../controller/getMetirials.js';
import { getAllTruckCapacities } from '../controller/getTruckCapacities.js';
import { getAllTruckTypes } from '../controller/getAllTruckTypes.js';
import { getAllTruckManufacturers } from '../controller/getAllTruckManufactures.js';
import { getAllTruckModels } from '../controller/getAllTruckModles.js';
import { insertTruck } from '../controller/AddTruck.js';
import { getTrucksByUserId } from '../controller/getTruckByUserId.js';
import { getAllLoads } from '../controller/getLoads.js';
import { getPaginatedTrucks } from '../controller/getTrucks.js';
import { getMatchingLoads } from '../controller/SerachLoads.js';
import { insertPostTrucks } from '../controller/postTruck.js';
import { getPostTrucks } from '../controller/getPostedTrucks.js';
import { getMatchingPostTrucks } from '../controller/SearchTruck.js';
import { insertBidsLoad } from '../controller/LoadBids.js';



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
TranspoterRouter.get("/getAllMaterials", getAllMaterials);
TranspoterRouter.get("/getAllTruckCapacities", getAllTruckCapacities);
TranspoterRouter.get("/getAllTruckTypes", getAllTruckTypes);
TranspoterRouter.get("/getAllTruckManufacturers", getAllTruckManufacturers);
TranspoterRouter.get("/getAllTruckModels", getAllTruckModels);
TranspoterRouter.get("/getTrucksByUserId", getTrucksByUserId);
TranspoterRouter.get("/getAllLoads", getAllLoads);
TranspoterRouter.get("/getPaginatedTrucks", getPaginatedTrucks);
TranspoterRouter.get("/getPostTrucks", getPostTrucks);

TranspoterRouter.post("/Register",Register)
TranspoterRouter.post("/send-otp",SentOtp)
TranspoterRouter.post("/Verify-otp",VerifyOTP)
TranspoterRouter.post("/updateTransporterBasicDetails",updateTransporterBasicDetails)
TranspoterRouter.post("/updateTransporterDocumentsDetails",insertTransporterDocs)
TranspoterRouter.post("/AddLoad",addLoad)
TranspoterRouter.post("/insertTruck", insertTruck);
TranspoterRouter.post("/getMatchingLoads", getMatchingLoads);
TranspoterRouter.post("/postTruck", insertPostTrucks);
TranspoterRouter.post("/getMatchingPostTrucks", getMatchingPostTrucks);
TranspoterRouter.post("/insertBidsLoad", insertBidsLoad);



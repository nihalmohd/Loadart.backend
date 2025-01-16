import express from 'express';
import { Register } from '../controller/UsersController/TranspoterSignUp.js';
import { SentOtp, VerifyOTP } from '../controller/UsersController/OTP.js';
import { Refresh } from '../controller/UsersController/CheckingAccessToken.js';
import { Logout } from '../controller/UsersController/Logout.js';
import { updateTransporterBasicDetails } from '../controller/UsersController/UpdateProfile.js';
import { insertTransporterDocs } from '../controller/UsersController/UpdateProfileDocuments.js';
import { addLoad } from '../controller/UsersController/AddLoad.js';
import { getLoadsByUserId } from '../controller/UsersController/GetLoadsByUserid.js';
import { getAllStates } from '../controller/UsersController/getAllStates.js';
import { getDistrictsByStateId } from '../controller/UsersController/getDistrictsByStateid.js';
import { getDocumentsByTransporterId, getTransporterById } from '../controller/UsersController/getTransporterById.js';
import { getAllMaterials } from '../controller/UsersController/getMetirials.js';
import { getAllTruckCapacities } from '../controller/UsersController/getTruckCapacities.js';
import { getAllTruckTypes } from '../controller/UsersController/getAllTruckTypes.js';
import { getAllTruckManufacturers } from '../controller/UsersController/getAllTruckManufactures.js';
import { getAllTruckModels } from '../controller/UsersController/getAllTruckModles.js';
import { insertTruck } from '../controller/UsersController/AddTruck.js';
import { getTrucksByUserId } from '../controller/UsersController/getTruckByUserId.js';
import { getAllLoads } from '../controller/UsersController/getLoads.js';
import { getPaginatedTrucks } from '../controller/UsersController/getTrucks.js';
import { getMatchingLoads } from '../controller/UsersController/SerachLoads.js';
import { insertPostTrucks } from '../controller/UsersController/postTruck.js';
import { getPostTrucks } from '../controller/UsersController/getPostedTrucks.js';
import { getMatchingPostTrucks } from '../controller/UsersController/SearchTruck.js';
import { insertBidsLoad, updateBidsLoadStatus } from '../controller/UsersController/LoadBids.js';
import { getBidsLoadWithDetails } from '../controller/UsersController/ViewAllBids.js';
import { myBids } from '../controller/UsersController/Mybids.js';
import { insertBidsTruck, updateBidsTruckStatus } from '../controller/UsersController/TruckBids.js';
import { getTruckBidsWithDetails } from '../controller/UsersController/getAllTruckBids.js';
import { getTruckBidsForUser } from '../controller/UsersController/MyTruckBids.js';
import { updateAndInsertSchedules } from '../controller/UsersController/LoadSchedules.js';
import { getLoadSchedulesByUser } from '../controller/UsersController/getLoadSchedulebyUserid.js';
import { updateBidsTruckAndInsertSchedule } from '../controller/UsersController/TruckSchedules.js';
import { getTruckSchedulesByUserId } from '../controller/UsersController/getTruckScheduleByUserid.js';
import { updateTruckSchedule } from '../controller/UsersController/updateTruckSchedules.js';
import { updateLoadSchedule } from '../controller/UsersController/updateLoadReciepts.js';
import { getBidsByUserAndLoad } from '../controller/UsersController/getBidsByUserAndLoad.js';
import { getTruckBidsForUserAndPostTruck } from '../controller/UsersController/getBidsByUserAndTruck.js';



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
TranspoterRouter.get("/viewAllBids", getBidsLoadWithDetails);
TranspoterRouter.get("/MyAllBids", myBids);
TranspoterRouter.get("/viewAllBidsTruck", getTruckBidsWithDetails);
TranspoterRouter.get("/MyAllTruckBids",getTruckBidsForUser );
TranspoterRouter.get("/loadschedules", getLoadSchedulesByUser);
TranspoterRouter.get("/truckschedules", getTruckSchedulesByUserId);
TranspoterRouter.get("/getBidsByUserAndLoadId",getBidsByUserAndLoad);
TranspoterRouter.get("/getBidsByUserAndTruck",getTruckBidsForUserAndPostTruck );



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
TranspoterRouter.post("/insertBidsTruck", insertBidsTruck);
TranspoterRouter.post("/insertLoadSchedule",updateAndInsertSchedules)
TranspoterRouter.post("/truckschedules", updateBidsTruckAndInsertSchedule);

TranspoterRouter.patch("/bidsLoadStatus", updateBidsLoadStatus);
TranspoterRouter.patch("/bidsTruckStatus", updateBidsTruckStatus);
TranspoterRouter.patch("/updateLoadSchedule", updateLoadSchedule);
TranspoterRouter.patch("/updateTruckSchedule", updateTruckSchedule);



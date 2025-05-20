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
import { updateLorryReceiptTruckSchedules, updateProofOfDeliveryTruckSchedules } from '../controller/UsersController/updateTruckSchedules.js';
import {  updateLorryReceipt, updateProofOfDelivery } from '../controller/UsersController/updateLoadReciepts.js';
import { getBidsByUserAndLoad } from '../controller/UsersController/getBidsByUserAndLoad.js';
import { getTruckBidsForUserAndPostTruck } from '../controller/UsersController/getBidsByUserAndTruck.js';
import { getNegotiationByUserAndBid, insertMyLoadBidsNegotiation, insertNegotiation } from '../controller/UsersController/negotiation.js';
import { getTruckNegotiationByUserAndBid, insertMyTruckNegotiation, insertTruckNegotiation } from '../controller/UsersController/TruckNegotiation.js';
import { updateLoad } from '../controller/UsersController/UpdateLoad.js';
import { updateTruck } from '../controller/UsersController/updateTruck.js';
import { deleteLoad } from '../controller/UsersController/RemoverLoad.js';
import { deleteTruck } from '../controller/UsersController/RemoveTruck.js';
import { getPlansByUserType } from '../controller/UsersController/SubscriptionPlan.js';
import { createUserSubscription } from '../controller/UsersController/UserSubsription.js';



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
TranspoterRouter.get("/getTruckNegotiationByUserAndBid",getTruckNegotiationByUserAndBid);
TranspoterRouter.get("/getNegotiationByUserAndBid",getNegotiationByUserAndBid) 
TranspoterRouter.get("/getTransporterById",getTransporterById)
TranspoterRouter.get("/getSubscriptionByUserTypeId",getPlansByUserType)



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
TranspoterRouter.post("/insertBidsLoad",insertBidsTruck );
TranspoterRouter.post("/insertBidsTruck",insertBidsLoad );
TranspoterRouter.post("/insertLoadSchedule",updateAndInsertSchedules)
TranspoterRouter.post("/truckschedules", updateBidsTruckAndInsertSchedule);
TranspoterRouter.post("/negotiations",insertNegotiation)
TranspoterRouter.post("/MyBidsnegotiations",insertMyLoadBidsNegotiation)
TranspoterRouter.post("/insertTruckNegotiation",insertTruckNegotiation)
TranspoterRouter.post("/insertMyTruckNegotiation",insertMyTruckNegotiation)
TranspoterRouter.post("/InsertUserSubscription",createUserSubscription)


TranspoterRouter.patch("/bidsLoadStatus", updateBidsLoadStatus);
TranspoterRouter.patch("/bidsTruckStatus", updateBidsTruckStatus);
TranspoterRouter.patch("/updateLorryReceiptLoadSchedule", updateLorryReceipt);
TranspoterRouter.patch("/updateProofOfDevliveryLoadSchedule", updateProofOfDelivery);
TranspoterRouter.patch("/updateLorryReceiptTruckSchedule", updateLorryReceiptTruckSchedules); 
TranspoterRouter.patch("/updateProofOfDevliveryTruckSchedule", updateProofOfDeliveryTruckSchedules); 
TranspoterRouter.patch("/updateLoad",updateLoad)
TranspoterRouter.patch("/updateTruck",updateTruck)


TranspoterRouter.delete("/deletLoads",deleteLoad)
TranspoterRouter.delete("/deletTrucks",deleteTruck)

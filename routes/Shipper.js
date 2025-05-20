import express from 'express';
import { Register } from '../controller/UsersController/ShipperRegister.js';
import { getDocumentsByShipperId, getShipperById, insertShipperDocs, updateShipperBasicDetails } from '../controller/UsersController/ShipperUpdateProfile.js';
import { ShipperVerifyOTP } from '../controller/UsersController/OTP.js';


export const ShipperRouter = express.Router()

ShipperRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Shipper side call recieved!");
    console.log("Hello, Loadart Shipper side call recieved!"); 
    
});

//get//
ShipperRouter.get("/getShipperById",getShipperById)
ShipperRouter.get("/getShipperDocsByUserId",getDocumentsByShipperId)

//post//
ShipperRouter.post("/Register",Register)
ShipperRouter.post("/InsertShipperDocs",insertShipperDocs)
ShipperRouter.post("/Verify-otp",ShipperVerifyOTP)

//patch//
ShipperRouter.patch("/UpdateShipperProfile",updateShipperBasicDetails)

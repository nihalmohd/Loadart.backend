import express from 'express';
import { Register } from '../controller/UsersController/ShipperRegister.js';
import { getDocumentsByShipperId, getShipperById, insertShipperDocs, updateShipperBasicDetails } from '../controller/UsersController/ShipperUpdateProfile.js';


export const ShipperRouter = express.Router()

ShipperRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Shipper side call recieved!");
    console.log("Hello, Loadart Shipper side call recieved!");
    
});

//get//
ShipperRouter.get("/getShipperById",getShipperById)
ShipperRouter.get("/getDocsByUserId",getDocumentsByShipperId)

//post//
ShipperRouter.post("/Register",Register)
ShipperRouter.post("/InsertShipperDocs",insertShipperDocs)

//patch//
ShipperRouter.patch("/UpdateShipperProfile",updateShipperBasicDetails)

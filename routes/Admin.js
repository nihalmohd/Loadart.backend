import express from 'express';
import { editUserType, getAllUserTypes, insertUserTypes, updateUserTypeStatus } from '../controller/AdminController/UserTypes.js';
import { getAllTruckTypes, insertTruckType, updateTruckTypeName, updateTruckTypeStatus } from '../controller/AdminController/TruckTypes.js';



export const AdminRouter = express.Router()

AdminRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Admin side call recieved!");
    console.log("Hello, Loadart Admin side call recieved!");
    
});
//get//
AdminRouter.get("/getAllUserTypes",getAllUserTypes)
AdminRouter.get("/GetAllTrucktypes", getAllTruckTypes);
//post//
AdminRouter.post("/inserUserType",insertUserTypes)
AdminRouter.post("/editUserType",editUserType)
AdminRouter.post("/insertTrucktypes", insertTruckType);

//update//
AdminRouter.patch("/updateUserTypeStatus", updateUserTypeStatus);
AdminRouter.patch("/updateTruckTypeName", updateTruckTypeName);
AdminRouter.patch("/updateTruckTypeStatus", updateTruckTypeStatus);
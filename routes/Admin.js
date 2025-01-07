import express from 'express';
import { editUserType, getAllUserTypes, insertUserTypes, updateUserTypeStatus } from '../controller/AdminController/UserTypes.js';



export const AdminRouter = express.Router()

AdminRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Transpoter side call recieved!");
    console.log("Hello, Loadart Transpoter side call recieved!");
    
});
//get//
AdminRouter.get("/getAllUserTypes",getAllUserTypes)
//post//
AdminRouter.post("/inserUserType",insertUserTypes)
AdminRouter.post("/editUserType",editUserType)
//update//
AdminRouter.patch("/updateUserTypeStatus", updateUserTypeStatus);
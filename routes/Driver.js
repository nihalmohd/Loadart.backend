import express from 'express';
import { Register } from '../controller/UsersController/DriverRegister.js';
import { updateDriverBasicDetails } from '../controller/UsersController/DriverUpdateProfile.js';


export const DriverRouter = express.Router()

DriverRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Driver side call recieved!");
    console.log("Hello, Loadart Driver side call recieved!");
    
});
//post//
DriverRouter.post("/Register",Register)
//get//
DriverRouter.get("/",)
//patch//
DriverRouter.patch("/UpdateDriverBasicDetails",updateDriverBasicDetails)
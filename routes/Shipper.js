import express from 'express';
import { Register } from '../controller/UsersController/ShipperRegister.js';


export const ShipperRouter = express.Router()

ShipperRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Shipper side call recieved!");
    console.log("Hello, Loadart Shipper side call recieved!");
    
});

//get//

//post//
ShipperRouter.post("/Register",Register)

//patch//


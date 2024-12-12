import express from 'express';
import { Register } from '../controller/TranspoterSignUp.js';


export const TranspoterRouter = express.Router()

TranspoterRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Transpoter side call recieved!");
    console.log("Hello, Loadart Transpoter side call recieved!");
    
});

TranspoterRouter.post("/Register",Register)

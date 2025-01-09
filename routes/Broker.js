import express from 'express';


export const BrokerRouter = express.Router()


BrokerRouter.get("/", (req, res) => {
    res.send("Hello, Loadart Broker side call recieved!");
    console.log("Hello, Loadart Broker side call recieved!");
    
});
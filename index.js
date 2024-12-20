import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { database } from "./Model/Config.js";
import { TranspoterRouter } from "./routes/Transpoter.js";

dotenv.config(); 

const app = express();
app.use(cookieParser());
const corsOptions = {
    origin: process.env.FRONTENDURL,  
    methods: ['DELETE', 'GET', 'POST', 'PUT'],  
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};
app.use(cors(corsOptions));
app.use(express.json());


database();

app.get("/", (req, res) => {
    res.send("Hello, Loadart Backend!");
});

app.use('/Transpoter',TranspoterRouter)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

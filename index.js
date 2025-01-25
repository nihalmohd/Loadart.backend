import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { database } from "./Model/Config.js";
import { TranspoterRouter } from "./routes/Transpoter.js";
import { AdminRouter } from "./routes/Admin.js";
import { BrokerRouter } from "./routes/Broker.js";
import { ShipperRouter } from "./routes/Shipper.js";
import { DriverRouter } from "./routes/Driver.js";

dotenv.config();

const app = express();
app.use(cookieParser());

// Updated CORS Options
const corsOptions = {
    origin: [process.env.FRONTEND_URL, process.env.LOCAL_FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable cookies and credentials
};
app.use(cors(corsOptions)); // Apply CORS middleware globally
app.use(express.json());

// Database connection
app.use((err, req, res, next) => {
    if (err.name === 'CorsError') {
        console.error("CORS Error: ", err.message);
        return res.status(500).json({ error: "CORS error occurred. Please check your configuration." });
    }
    console.error("Unexpected Error: ", err.message);
    res.status(500).json({ error: "An unexpected error occurred." });
});
database();

// Base route
app.get("/", (req, res) => {
    res.send("Hello, Loadart Backend!");
});

// Route definitions
app.use('/Transpoter', TranspoterRouter);
app.use('/Broker', BrokerRouter);
app.use('/Shipper', ShipperRouter);
app.use('/Driver', DriverRouter);
app.use('/Admin', AdminRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(process.env.FRONTEND_URL,"this is frount end url ");
    console.log(process.env.LOCAL_FRONTEND_URL,"this is local frount end url ");
    
    console.log(`Server running at http://localhost:${PORT}/`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { database } from "./Model/Config.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Connect to the database
database();

app.get("/", (req, res) => {
    res.send("Hello, Loadart Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
}));


app.get("/", (req, res) => {
    res.send("Hello, ES Modules with dotenv and CORS!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
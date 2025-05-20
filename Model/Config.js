import pkg from "pg"; 
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; 


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, 
});


export const database = async () => {
    try {
        await pool.connect();
        console.log("Connected to PostgreSQL database successfully!");
    } catch (error) {
        console.error("Error connecting to PostgreSQL:", error.message);
    }
};

export default pool;

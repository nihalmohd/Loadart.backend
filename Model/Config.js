import pkg from "pg"; 
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; 



const pool = new Pool({
    host: "loadartmain1.cfcwe62c4ss7.eu-north-1.rds.amazonaws.com",
    port: 5432,
    user: "admin_loadart",
    password: "l.12345678",
    database: "postgres",
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

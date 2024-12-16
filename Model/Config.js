import pkg from "pg"; 
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; 

// PORT=5000
// FRONTEND_URL=http://localhost:5173
// DB_HOST=loadartmain1.cfcwe62c4ss7.eu-north-1.rds.amazonaws.com
// DB_PORT=5432
// DB_USER=admin_loadart
// DB_PASSWORD=l.12345678
// DB_NAME=postgres


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

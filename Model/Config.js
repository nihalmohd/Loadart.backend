import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// DB_HOST="loadartmain1.cfcwe62c4ss7.eu-north-1.rds.amazonaws.com"    
// DB_PORT="5432"                  
// DB_USER="admin_loadart"     
// DB_PASSWORD="l.12345678"  
// DB_NAME="postgres"

var client1 = new pg.Client({
    host: "loadartmain1.cfcwe62c4ss7.eu-north-1.rds.amazonaws.com",
    port:"5432",
    user:"admin_loadart",
    password: "l.12345678",
    database: "postgres",
    ssl: false
}); 
// client1.connect();

export const database = async () => {
    try {
        const client = await client1.connect();
        console.log("Connected to PostgreSQL successfully!");
        client.release(); 
    } catch (err) {
        console.error("Error connecting to PostgreSQL:", err);
        throw err;
    }
};

export default pool;
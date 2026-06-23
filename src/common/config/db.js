import mysql from "mysql2/promise";
import dotenv from "dotenv";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Pool Connected");
    connection.release();
  } catch (error) {
    console.error("MySQL Pool Connection Failed:", error.message);
    process.exit(1);
  }
}

export default pool;
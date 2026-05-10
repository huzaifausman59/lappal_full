import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host:     process.env.MYSQLHOST     || process.env.DB_HOST,
  user:     process.env.MYSQLUSER     || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
  port:     process.env.MYSQLPORT     || process.env.DB_PORT || 3000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});



console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
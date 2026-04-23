import { db } from "./src/config/db_config.js";

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("Connected to database 🎉");
    connection.release();
  }
});
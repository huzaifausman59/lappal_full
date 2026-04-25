import { db } from "../config/db_config.js";

// CREATE USER
export const createUser = (username, email, password, callback) => {
  const sql =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(sql, [username, email, password], callback);
};

// FIND USER BY EMAIL
export const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

// FIND USER BY EMAIL OR USERNAME 
export const findUserByEmailOrUsername = (email, username, callback) => {
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(sql, [email, username], callback);
};

// FIND USER BY ID
export const findUserById = (id, callback) => {
  const sql = "SELECT id, username, email FROM users WHERE id = ?";
  db.query(sql, [id], callback);
};
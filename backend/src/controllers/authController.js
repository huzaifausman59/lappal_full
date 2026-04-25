import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail,findUserByEmailOrUsername } from "../models/userModel.js";

// SIGNUP
export const signup = (req, res) => {
  const { username, email, password } = req.body;

  // CHECK DUPLICATES
  findUserByEmailOrUsername(email, username, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      const existingUser = result[0];

      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already in use" });
      }

      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // HASH PASSWORD
    const hashedPassword = bcrypt.hashSync(password, 10);

    // CREATE USER
    createUser(username, email, hashedPassword, (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User created successfully " });
    });
  });
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({
      message: "Login successful ",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });
};
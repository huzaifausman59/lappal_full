import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createDeal } from "../controllers/dealsController.js";

const router = express.Router();

router.post("/", verifyToken, createDeal);

export default router;
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createReview,
  getUserReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// create review
router.post("/", verifyToken, createReview);

// get reviews for a user
router.get("/user/:userId", getUserReviews);

export default router;
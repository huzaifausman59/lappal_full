import express from "express";
import { getProfile,updateProfile, getPublicProfile,getUserListings} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, updateProfile);

router.get("/:userId", getPublicProfile);

router.get("/:userId/listings", getUserListings);

export default router;
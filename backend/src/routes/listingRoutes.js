import express from "express";
import { getAllListings,
         createListing,
         updateListing,
         deleteListing,
         getListingDetails} from "../controllers/listingController.js";
         
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllListings);

router.post("/", verifyToken, createListing);

router.put("/:listingId", verifyToken, updateListing);

router.delete("/:listingId", verifyToken, deleteListing);

router.get("/:listingId", getListingDetails);
export default router;
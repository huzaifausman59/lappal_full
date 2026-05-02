import { getAllListingsModel,
         createListingModel ,
         getListingById,
         updateListingModel,
         deleteListingModel,
         getListingDetailsModel } from "../models/listingModel.js";

export const getAllListings = (req, res) => {
  const { brand, price } = req.query;

  getAllListingsModel(brand, price, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

export const createListing = (req, res) => {
  const userId = req.user.id;

  const {
    title,
    brand,
    price,
    description,
    main_image,
    condition_rating,
  } = req.body;

  if (!title || !brand || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  createListingModel(
    userId,
    title,
    brand,
    price,
    description,
    main_image,
    condition_rating,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Listing created successfully",
        listingId: result.insertId,
      });
    }
  );
};


export const updateListing = (req, res) => {
  const userId = req.user.id;
  const listingId = req.params.listingId;

  const updates = req.body;

  // STEP 1: get listing
  getListingById(listingId, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const listing = results[0];

    // STEP 2: ownership check
    if (listing.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // STEP 3: update
    updateListingModel(listingId, updates, (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Listing updated successfully" });
    });
  });
};


export const deleteListing = (req, res) => {
  const userId = req.user.id;
  const listingId = req.params.listingId;

  getListingById(listingId, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const listing = results[0];

    if (listing.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    deleteListingModel(listingId, (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Listing deleted permanently" });
    });
  });
};

export const getListingDetails = (req, res) => {
  const listingId = req.params.listingId;

  getListingDetailsModel(listingId, (err, result) => {
    if (err) return res.status(500).json(err);

    if (!result) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(result);
  });
};